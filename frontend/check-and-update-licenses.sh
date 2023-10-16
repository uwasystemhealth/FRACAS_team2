npx license-checker --exclude 'MIT, ISC, Apache-2.0, BSD-2-Clause, BSD-3-Clause, MPL-2.0, CC-BY-4.0, CC0-1.0, 0BSD, GPL-3.0, Python-2.0'
# NOTE ABOUT Python-2.0 license:
# https://github.com/eslint/eslint/pull/14890
# https://github.com/markdown-it/markdown-it/issues/926
# Only used for development, not in production so should be ok.

yarn licenses generate-disclaimer --prod > ../license/FRONTEND-DEPENDENCIES-LICENSES.txt