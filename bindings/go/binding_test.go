package tree_sitter_pharo_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_pharo "github.com/kilian-kier/tree-sitter-pharo/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_pharo.Language())
	if language == nil {
		t.Errorf("Error loading Pharo grammar")
	}
}
