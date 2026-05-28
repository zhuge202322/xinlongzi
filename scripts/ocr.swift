import Foundation
import AppKit
import Vision

func recognize(_ path: String) {
    guard let image = NSImage(contentsOfFile: path) else {
        print("### \(path)")
        print("[image load failed]")
        return
    }

    var rect = CGRect(origin: .zero, size: image.size)
    guard let cgImage = image.cgImage(forProposedRect: &rect, context: nil, hints: nil) else {
        print("### \(path)")
        print("[cg image failed]")
        return
    }

    let request = VNRecognizeTextRequest()
    request.recognitionLevel = .accurate
    request.usesLanguageCorrection = true
    request.recognitionLanguages = ["en-US", "zh-Hans"]
    request.minimumTextHeight = 0.006

    let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])
    do {
        try handler.perform([request])
    } catch {
        print("### \(path)")
        print("[ocr failed] \(error)")
        return
    }

    let observations = (request.results ?? []).sorted {
        if abs($0.boundingBox.midY - $1.boundingBox.midY) > 0.015 {
            return $0.boundingBox.midY > $1.boundingBox.midY
        }
        return $0.boundingBox.minX < $1.boundingBox.minX
    }

    print("### \(path)")
    for observation in observations {
        if let candidate = observation.topCandidates(1).first {
            let box = observation.boundingBox
            print(String(format: "[%.3f %.3f %.3f %.3f] %@", box.minX, box.minY, box.width, box.height, candidate.string))
        }
    }
}

let paths = Array(CommandLine.arguments.dropFirst())
for path in paths {
    recognize(path)
}
