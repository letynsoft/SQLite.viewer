// swift-tools-version:4.0

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
            dependencies: ["Http.swift", "SQLite.swift"],
            path: "Sources",
            exclude: ["SQLite.viewer-Example"]),
        .testTarget(
            name: "SQLiteViewerTests",
            dependencies: ["Http.swift", "SQLite.swift"]),
    ]
)
