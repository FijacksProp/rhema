from wagtail import blocks
from wagtail.images.blocks import ImageChooserBlock


class PhotoBlock(blocks.StructBlock):
    image = ImageChooserBlock()
    alt = blocks.CharBlock(help_text="Describe the photograph for visitors using screen readers.")
    caption = blocks.CharBlock(required=False)


class SectionBlock(blocks.StructBlock):
    heading = blocks.CharBlock()
    body = blocks.RichTextBlock(features=["h3", "bold", "italic", "ol", "ul", "link"])


class CardBlock(blocks.StructBlock):
    title = blocks.CharBlock()
    description = blocks.TextBlock()


class QuestionBlock(blocks.StructBlock):
    question = blocks.CharBlock()
    answer = blocks.RichTextBlock(features=["bold", "italic", "ol", "ul", "link"])


class EditorialBlocks(blocks.StreamBlock):
    section = SectionBlock(icon="doc-full")
    photo = PhotoBlock(icon="image")
    cards = blocks.ListBlock(CardBlock(), icon="list-ul")
    questions = blocks.ListBlock(QuestionBlock(), icon="help")
