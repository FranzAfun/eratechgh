"""Requires Python 3 + Pillow; run only when assets change, never during pnpm build.

Usage: py -3 scripts/prepare-assets.py --source <incoming-folder>
Reads the owner's logos/work/social folders without modifying them. Outputs are committed.
"""

import argparse
from hashlib import sha256
from io import BytesIO
from pathlib import Path

from PIL import Image, ImageDraw, ImageOps


ROOT = Path(__file__).resolve().parents[1]
RESAMPLE = Image.Resampling.LANCZOS


def clean(image):
    """Keep pixels, without EXIF, profiles or other source metadata."""
    return Image.frombytes(image.mode, image.size, image.tobytes())


def save(image, path, **options):
    path.parent.mkdir(parents=True, exist_ok=True)
    clean(image).save(path, **options)


def contained(image, size):
    canvas = Image.new("RGBA", size, (0, 0, 0, 0))
    fitted = ImageOps.contain(image, size, RESAMPLE)
    canvas.alpha_composite(fitted, ((size[0] - fitted.width) // 2, (size[1] - fitted.height) // 2))
    return canvas


def prepare_logos(source):
    for colour in ("black", "purple", "white"):
        name = f"era-technologies-logo-{colour}.png"
        with Image.open(source / "logos" / name) as original:
            image = original.convert("RGBA")
            bounds = image.getchannel("A").getbbox()
            if not bounds:
                raise ValueError(f"Empty logo: {name}")
            trimmed = clean(image.crop(bounds))
        save(trimmed, ROOT / "design-system/assets/logo" / name, optimize=True)
        if colour == "white":
            white = trimmed

    for role, width, height in (("header", 69, 40), ("drawer", 62, 36), ("footer", 82, 48)):
        for density in (1, 2):
            image = contained(white, (width * density, height * density))
            suffix = "" if density == 1 else "@2x"
            for extension in ("png", "webp"):
                save(image, ROOT / f"public/images/brand/logo-white-{role}{suffix}.{extension}",
                     **({"lossless": True, "method": 6} if extension == "webp" else {"optimize": True}))

    # A 2x PNG renders at 120 x 70 in emails. The share image embeds the trimmed original.
    save(contained(white, (240, 140)), ROOT / "public/email/logo-white.png", optimize=True)

    # Separate the ERA letters from the lower word at the transparent horizontal gap.
    rows = white.getchannel("A").getprojection()[1]
    gaps = []
    start = None
    for index, occupied in enumerate(rows + [1]):
        if not occupied and start is None:
            start = index
        if occupied and start is not None:
            if start > white.height * 0.4 and index < white.height * 0.95:
                gaps.append((index - start, start))
            start = None
    if not gaps or max(gaps)[0] < 8:
        raise ValueError("Could not identify the gap above technologies in the supplied logo")
    letters = white.crop((0, 0, white.width, max(gaps)[1]))
    letters = letters.crop(letters.getchannel("A").getbbox())
    square = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    ImageDraw.Draw(square).rounded_rectangle((0, 0, 511, 511), radius=96, fill="#3B1174")
    fitted = ImageOps.contain(letters, (432, 320), RESAMPLE)
    square.alpha_composite(fitted, ((512 - fitted.width) // 2, (512 - fitted.height) // 2))
    save(square.resize((32, 32), RESAMPLE), ROOT / "public/favicon.png", optimize=True)
    save(square.resize((180, 180), RESAMPLE), ROOT / "public/apple-touch-icon.png", optimize=True)
    save(square, ROOT / "public/favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])


def prepare_work(source):
    for path in sorted((source / "work").glob("*.jpg")):
        with Image.open(path) as original:
            image = clean(ImageOps.exif_transpose(original).convert("RGB"))
        if image.width < 640:
            raise ValueError(f"Source is smaller than 640 px: {path.name}")
        for width in sorted({640, image.width}):
            height = round(image.height * width / image.width)
            output = image.resize((width, height), RESAMPLE) if width != image.width else image
            for quality in (90, 86, 82, 78, 74, 70):
                buffer = BytesIO()
                clean(output).save(buffer, format="WEBP", quality=quality, method=6)
                if buffer.tell() <= 400_000:
                    break
            else:
                raise ValueError(f"Cannot fit {path.name} below 400 KB")
            target = ROOT / f"public/images/work/{path.stem}-{width}.webp"
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(buffer.getvalue())
            print(f"{target.relative_to(ROOT)}: {width} x {height}, {buffer.tell()} bytes")


def prepare_socials(source):
    for path in sorted((source / "social").glob("*.webp")):
        with Image.open(path) as original:
            image = original.convert("RGBA")
            bounds = image.getchannel("A").getbbox()
            image = clean(image.crop(bounds))
        for size in (24, 48):
            output = contained(image, (size, size))
            for extension in ("webp", "png"):
                save(output, ROOT / f"public/images/social/{path.stem}-{size}.{extension}",
                     **({"lossless": True, "method": 6} if extension == "webp" else {"optimize": True}))
        save(contained(image, (48, 48)), ROOT / f"public/email/{path.stem}.png", optimize=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", required=True, type=Path)
    source = parser.parse_args().source.resolve(strict=True)
    for folder in ("logos", "work", "social"):
        if not (source / folder).is_dir():
            raise ValueError(f"Missing input folder: {folder}")
    originals = {p: sha256(p.read_bytes()).digest() for p in source.rglob("*") if p.is_file()}
    prepare_logos(source)
    prepare_work(source)
    prepare_socials(source)
    if any(sha256(path.read_bytes()).digest() != digest for path, digest in originals.items()):
        raise RuntimeError("The read-only source changed during preparation")
    print("Assets prepared; source files are unchanged. Run pnpm og:image separately.")


if __name__ == "__main__":
    main()
