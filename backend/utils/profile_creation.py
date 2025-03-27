from io import BytesIO

from django.core.files.uploadedfile import InMemoryUploadedFile
from PIL import Image, ImageDraw, ImageFont


def generate_profile_image(first_name, last_name):
    """
    Generates an initial-based profile picture.
    """

    initials = f"{first_name[0]}{last_name[0]}".upper()

    size = (200, 200)  # Image size
    bg_color = (100, 100, 255)  # Blue background
    text_color = (255, 255, 255)  # White text
    font_size = 100  # Adjust font size

    # Create image
    img = Image.new("RGB", size, bg_color)
    draw = ImageDraw.Draw(img)

    try:
        font = ImageFont.truetype("arial.ttf", font_size)  # Windows
    except IOError:
        try:
            font = ImageFont.truetype(
                "/usr/share/fonts/dejavu/DejaVuSans-Bold.ttf", font_size
            )  # Linux
        except IOError:
            font = ImageFont.load_default()

    text_width, text_height = draw.textbbox((0, 0), initials, font=font)[2:]
    position = ((size[0] - text_width) // 2, (size[1] - text_height) // 2)

    draw.text(position, initials, fill=text_color, font=font)

    # Save image to memory
    image_io = BytesIO()
    img.save(image_io, format="PNG")
    image_io.seek(0)

    return InMemoryUploadedFile(
        image_io,
        None,
        f"{first_name}_{last_name}.png",
        "image/png",
        image_io.getbuffer().nbytes,
        None,
    )
