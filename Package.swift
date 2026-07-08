// swift-tools-version:5.3

import PackageDescription

let package = Package(
    name: "SQLite.viewer",
    products: [
        .library(
            name: "SQLite.viewer",
            targets: ["SQLiteViewer"]),
    ],
    dependencies: [
        .package(url: "https://github.com/BiAtoms/Http.swift.git", .upToNextMajor(from: "2.2.1")),
        .package(url: "https://github.com/stephencelis/SQLite.swift.git", .upToNextMajor(from: "0.16.0")),
    ],
    targets: [
        .target(
            name: "SQLiteViewer",
            dependencies: [
              .product(name: "HttpSwift", package: "http.swift"),
              .product(name: "SQLite", package: "sqlite.swift")
            ],
            path: "Sources",
            resources: [.copy("Assets")]),
        .testTarget(
            name: "SQLiteViewerTests",
            dependencies: [
              .product(name: "HttpSwift", package: "http.swift"),
              .product(name: "SQLite", package: "sqlite.swift")
            ]),
    ]
)
