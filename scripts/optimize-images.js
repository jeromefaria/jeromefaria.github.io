import sharp from 'sharp'
import { readdir, stat } from 'fs/promises'
import { join, extname, basename } from 'path'

const IMAGES_DIR = 'public/images'
const QUALITY = 80

async function optimizeImages() {
  const files = await readdir(IMAGES_DIR)
  const jpgFiles = files.filter(f => extname(f).toLowerCase() === '.jpg')

  console.log(`Converting ${jpgFiles.length} images to WebP...`)

  for (const file of jpgFiles) {
    const inputPath = join(IMAGES_DIR, file)
    const outputPath = join(IMAGES_DIR, basename(file, '.jpg') + '.webp')

    const originalStats = await stat(inputPath)

    await sharp(inputPath)
      .webp({ quality: QUALITY })
      .toFile(outputPath)

    const newStats = await stat(outputPath)
    const savings = ((1 - newStats.size / originalStats.size) * 100).toFixed(1)

    console.log(`  ${file} -> ${basename(outputPath)} (${savings}% smaller)`)
  }

  console.log('Done!')
}

optimizeImages().catch(console.error)
