import XCTest
import SwiftTreeSitter
import TreeSitterPharo

final class TreeSitterPharoTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_pharo())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Pharo grammar")
    }
}
