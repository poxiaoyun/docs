import os, filecmp

base = '/Volumes/datas/project/rune/runeDoc/docs/src/pages/docs/cn/40.ecosystem/02.hygon'
pairs = [
    ('02.k8s.md', '02.k8s-components.md'),
    ('03.overview.md', '03.k8s-overview.md'),
    ('04.label-node.md', '04.k8s-label-node.md'),
    ('05.exporter.md', '05.k8s-exporter.md'),
    ('06.device-plugin-standard.md', '06.k8s-device-plugin-standard.md'),
    ('07.device-plugin-mig.md', '07.k8s-device-plugin-mig.md'),
    ('08.vdcu-dynamic-splitting.md', '08.k8s-vdcu-dynamic-splitting.md'),
    ('09.faq.md', '09.k8s-faq.md'),
]
for old, new in pairs:
    r = filecmp.cmp(os.path.join(base, old), os.path.join(base, new))
    status = 'IDENTICAL' if r else 'DIFFERENT'
    print(status + ': ' + old + ' <=> ' + new)
