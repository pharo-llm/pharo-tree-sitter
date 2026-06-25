# Tree-Sitter Grammar for Pharo Smalltalk

An adaptation of the [Tree-Sitter Smalltalk grammar](https://github.com/tom95/tree-sitter-smalltalk) for Pharo.
It also includes parsing whole files (in Tonel format).

## Python Package

Install the package locally from this repository:

```sh
python3 -m pip install .
```

After the package is published to PyPI, install it with:

```sh
python3 -m pip install pharo-tree-sitter
```

Use it from Python with the `tree_sitter_pharo` import:

```python
import tree_sitter
import tree_sitter_pharo

PHARO_LANGUAGE = tree_sitter.Language(tree_sitter_pharo.language())
print(tree_sitter_pharo.HIGHLIGHTS_QUERY)
```

Build the source distribution and wheel:

```sh
python3 -m pip install build twine
python3 -m build
```

Upload the package to PyPI:

```sh
python3 -m twine upload dist/*
```
