// swift-tools-version: 5.9
// SPDX-License-Identifier: MPL-2.0

import PackageDescription

let package = Package(
    name: "ConvergioApp",
    platforms: [
        .macOS(.v14)
    ],
    targets: [
        .executableTarget(
            name: "ConvergioApp",
            path: "ConvergioMissionControl",
            exclude: ["Info.plist"]
        )
    ]
)
