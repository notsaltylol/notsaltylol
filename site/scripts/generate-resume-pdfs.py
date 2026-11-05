"""Generate and verify all single-page resumes from the website's JSON source.

Requires reportlab and pypdf. No network requests or private contact fields.
Run with: python3 scripts/generate-resume-pdfs.py (from site/ or repo root).
"""
from hashlib import sha256
from html import escape
from io import BytesIO
import json
from pathlib import Path
import re

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'src/content/resume.json'
OUT = ROOT / 'public/resumes'


def selected(entries, focus):
    result = []
    for entry in entries:
        bullets = [b for b in entry['bullets'] if focus == 'all' or focus in b['focus']]
        if bullets:
            result.append({**entry, 'bullets': bullets})
    return result


def build(data, variant, size):
    output = BytesIO()
    body = ParagraphStyle('body', fontName='Helvetica', fontSize=size, leading=size * 1.22,
                          textColor=colors.HexColor('#17202c'), alignment=TA_LEFT, spaceAfter=2)
    heading = ParagraphStyle('heading', parent=body, fontName='Helvetica-Bold', fontSize=size + .8,
                             spaceBefore=8, spaceAfter=4, keepWithNext=True)
    entry = ParagraphStyle('entry', parent=body, fontSize=size, spaceBefore=4,
                           spaceAfter=2, keepWithNext=True)
    bullet = ParagraphStyle('bullet', parent=body, leftIndent=10, firstLineIndent=-8, spaceAfter=2)
    title = ParagraphStyle('title', parent=body, fontName='Helvetica-Bold', fontSize=20, leading=24,
                           spaceAfter=3, keepWithNext=True)
    small = ParagraphStyle('small', parent=body, fontSize=size - .5, leading=size * 1.15)
    if variant['id'] == 'all':
        body.spaceAfter = 1
        heading.spaceBefore = 5
        heading.spaceAfter = 3
        entry.spaceBefore = 2
        bullet.spaceAfter = 1
        bullet.leading = size * 1.15
    story = [Paragraph(escape(data['name']), title),
             Paragraph(escape(variant['title']), body),
             Paragraph(' | '.join(f'<a href="{escape(x["href"])}">{escape(x["text"])}</a>' for x in data['links']), small),
             Spacer(1, 4), Paragraph(escape(variant['summary']), body),
             Paragraph('Experience', heading)]
    for job in selected(data['experience'], variant['id']):
        story.append(Paragraph(f'<b>{escape(job["company"])}</b> | {escape(job["role"])} | {escape(job["start"])} - {escape(job["end"])}', entry))
        for b in job['bullets']:
            story.append(Paragraph('- ' + escape(b['text']), bullet))
    story.append(Paragraph('Education', heading))
    edu = data['education']
    story.append(Paragraph(f'<b>{escape(edu["school"])}</b> | {escape(edu["degree"])} | {escape(edu["graduated"])} | GPA: {escape(edu["gpa"])}', body))
    story.extend([Paragraph('Skills', heading), Paragraph(escape(', '.join(variant['skills'])), body)])
    projects = selected(data['projects'], variant['id'])
    if projects:
        story.append(Paragraph('Projects & Research', heading))
        for project in projects:
            name = escape(project['name'])
            if project.get('href'):
                name = f'<a href="{escape(project["href"])}" color="#2459a6"><u>{name}</u></a>'
            story.append(Paragraph(f'<b>{name}</b> | {escape(", ".join(project["tools"]))}', entry))
            if project['note']:
                story.append(Paragraph(escape(project['note']), small))
            for b in project['bullets']:
                story.append(Paragraph('- ' + escape(b['text']), bullet))
    doc = SimpleDocTemplate(output, pagesize=letter, rightMargin=34, leftMargin=34,
                            topMargin=28, bottomMargin=28,
                            title=f'Leon Kwan - {variant["label"]} Resume', author='Leon Kwan',
                            subject=f'{variant["label"]} engineering resume')
    doc.build(story)
    return output.getvalue()


def normalize(text):
    return re.sub(r'\s+', ' ', text).strip()


def main():
    data = json.loads(SOURCE.read_text())
    OUT.mkdir(parents=True, exist_ok=True)
    manifest = {'sourceSha256': sha256(SOURCE.read_bytes()).hexdigest(), 'generatorSha256': sha256(Path(__file__).read_bytes()).hexdigest(), 'files': []}
    # Fit at readable sizes; never drop or truncate a selected achievement.
    for variant in data['variants']:
        for size in [11, 10.5, 10, 9.5]:
            pdf = build(data, variant, size)
            reader = PdfReader(BytesIO(pdf))
            if len(reader.pages) == 1:
                break
        else:
            raise RuntimeError(f'{variant["id"]} does not fit one page at 9.5pt; edit the selection.')
        text = normalize(reader.pages[0].extract_text())
        expected = selected(data['experience'], variant['id']) + selected(data['projects'], variant['id'])
        for item in expected:
            for b in item['bullets']:
                assert normalize(b['text']) in text, f'Missing bullet: {b["id"]}'
        assert data['name'] in text and data['education']['school'] in text
        assert '@' not in text and not re.search(r'(?:\d[ -]?){10}', text), 'Private contact information found'
        assert '/XObject' not in reader.pages[0]['/Resources'], 'Unexpected images in resume'
        uris = [a.get_object().get('/A', {}).get('/URI', '') for a in reader.pages[0].get('/Annots', [])]
        assert all(not uri.startswith('mailto:') and not uri.startswith('tel:') for uri in uris)
        for project in selected(data['projects'], variant['id']):
            if project.get('href'):
                assert project['href'] in uris, f'Missing project hyperlink: {project["id"]}'
        name = f'leon-kwan-{variant["id"]}.pdf'
        (OUT / name).write_bytes(pdf)
        manifest['files'].append({'focus': variant['id'], 'filename': name, 'sha256': sha256(pdf).hexdigest(),
                                  'pages': 1, 'fontSize': size,
                                  'bulletCount': sum(len(e['bullets']) for e in expected)})
        print(f'{variant["id"]}: 1 page, {size}pt, {manifest["files"][-1]["bulletCount"]} bullets; text verified')
    (OUT / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')


if __name__ == '__main__':
    main()
