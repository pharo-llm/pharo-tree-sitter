//! This crate provides Pharo language support for the [tree-sitter] parsing library.
//!
//! Typically, you will use the [`LANGUAGE`] constant to add this language to a
//! tree-sitter [`Parser`], and then use the parser to parse some code:
//!
//! ```
//! let code = r#"test: a with: b and: c
//!                    <testcase>
//!                    <author: 'Kilian Kier'>
//!                    | sum col stream blockResult bytes litArr dynArr charSym superHash flag spacedSym |
//!
//!                    "Arithmetic + unary/binary/keyword chains"
//!                    sum := ((a + b) * c) + 255 - -3.14.
//!                    sum := 1
//!                      + 2;
//!                      - 3.
//!
//!                    spacedSym := #'spaced symbol'.
//!                    charSym := $Z.
//!
//!                    bytes := #[1 2 255].
//!
//!                    litArr := #(
//!                      1 2 3
//!                      $A $:
//!                      'hello'
//!                      #foo #'+'
//!                      ('nested' #array)
//!                      := ^ .
//!                      identifier
//!                    ).
//!
//!                    dynArr := {
//!                      sum .
//!                      a asString .
//!                      (b isNil ifTrue: [ 'nil' ] ifFalse: [ b printString ])
//!                    }.
//!
//!                    col := OrderedCollection new
//!                      add: a;
//!                      addAll: { b . c };
//!                      yourself.
//!
//!                    blockResult := (1 to: 3) collect: [ :i | | tmp |
//!                      tmp := i * sum.
//!                      tmp asString
//!                    ].
//!
//!                    stream := (ReadStream on: 'abc').
//!
//!                    flag := true & false.
//!
//!                    c isNil
//!                      ifTrue: [ col add: nil ]
//!                      ifFalse: [
//!                        col add: (self format: sum with: c).
//!                        Transcript
//!                          show: ('sum = ', sum asString);
//!                          cr;
//!                          show: (col size asString);
//!                          yourself
//!                      ].
//!
//!                    superHash := super hash.
//!                    thisContext size.  "touch thisContext"
//!
//!                    Transcript
//!                      show: spacedSym printString;
//!                      cr.
//!
//!                    ^ { sum . col size . blockResult size . superHash }
//! "#;
//! let mut parser = tree_sitter::Parser::new();
//! let language = tree_sitter_pharo::LANGUAGE;
//! parser
//!     .set_language(&language.into())
//!     .expect("Error loading Pharo parser");
//! let tree = parser.parse(code, None).unwrap();
//! assert!(!tree.root_node().has_error());
//! ```
//!
//! [`Parser`]: https://docs.rs/tree-sitter/0.25.8/tree_sitter/struct.Parser.html
//! [tree-sitter]: https://tree-sitter.github.io/

use tree_sitter_language::LanguageFn;

extern "C" {
    fn tree_sitter_pharo() -> *const ();
}

/// The tree-sitter [`LanguageFn`] for this grammar.
pub const LANGUAGE: LanguageFn = unsafe { LanguageFn::from_raw(tree_sitter_pharo) };

/// The content of the [`node-types.json`] file for this grammar.
///
/// [`node-types.json`]: https://tree-sitter.github.io/tree-sitter/using-parsers/6-static-node-types
pub const NODE_TYPES: &str = include_str!("../../src/node-types.json");

// NOTE: uncomment these to include any queries that this grammar contains:

// pub const HIGHLIGHTS_QUERY: &str = include_str!("../../queries/highlights.scm");
// pub const INJECTIONS_QUERY: &str = include_str!("../../queries/injections.scm");
// pub const LOCALS_QUERY: &str = include_str!("../../queries/locals.scm");
// pub const TAGS_QUERY: &str = include_str!("../../queries/tags.scm");

#[cfg(test)]
mod tests {
    #[test]
    fn test_can_load_grammar() {
        let mut parser = tree_sitter::Parser::new();
        parser
            .set_language(&super::LANGUAGE.into())
            .expect("Error loading Pharo parser");
    }
}
