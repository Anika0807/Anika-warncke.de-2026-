// Build Script for CSS/JS Minification
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class BuildOptimizer {
  constructor() {
    this.projectRoot = '/Users/Anika/Desktop/anika-warncke.de/anika-warncke.de';
    this.srcDir = path.join(this.projectRoot, 'src');
    this.distDir = path.join(this.projectRoot, 'dist');
  }

  // Minify CSS
  minifyCSS(inputFile, outputFile) {
    try {
      const css = fs.readFileSync(inputFile, 'utf8');
      
      // Simple CSS minification
      const minified = css
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
        .replace(/\s+/g, ' ') // Collapse whitespace
        .replace(/;\s*}/g, '}') // Remove semicolon before }
        .replace(/:\s+/g, ':') // Remove space after :
        .replace(/,\s+/g, ',') // Remove space after ,
        .replace(/{\s+/g, '{') // Remove space after {
        .replace(/}\s+/g, '}') // Remove space after }
        .trim();

      if (!fs.existsSync(path.dirname(outputFile))) {
        fs.mkdirSync(path.dirname(outputFile), { recursive: true });
      }

      fs.writeFileSync(outputFile, minified);
      console.log(`✅ CSS minified: ${outputFile}`);
      
      return minified.length;
    } catch (error) {
      console.error(`❌ Error minifying CSS: ${error.message}`);
      return 0;
    }
  }

  // Minify JavaScript
  minifyJS(inputFile, outputFile) {
    try {
      const js = fs.readFileSync(inputFile, 'utf8');
      
      // Simple JS minification (basic)
      const minified = js
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
        .replace(/\/\/.*$/gm, '') // Remove line comments
        .replace(/\s+/g, ' ') // Collapse whitespace
        .replace(/;\s*}/g, ';}') // Clean up semicolons
        .replace(/{\s+/g, '{') // Remove space after {
        .replace(/}\s+/g, '}') // Remove space after }
        .replace(/,\s+/g, ',') // Remove space after ,
        .trim();

      if (!fs.existsSync(path.dirname(outputFile))) {
        fs.mkdirSync(path.dirname(outputFile), { recursive: true });
      }

      fs.writeFileSync(outputFile, minified);
      console.log(`✅ JS minified: ${outputFile}`);
      
      return minified.length;
    } catch (error) {
      console.error(`❌ Error minifying JS: ${error.message}`);
      return 0;
    }
  }

  // Convert images to WebP format
  convertToWebP(inputDir, outputDir) {
    try {
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const imageFiles = this.findImageFiles(inputDir);
      let convertedCount = 0;

      imageFiles.forEach(file => {
        const ext = path.extname(file).toLowerCase();
        if (['.jpg', '.jpeg', '.png'].includes(ext)) {
          const relativePath = path.relative(inputDir, file);
          const outputPath = path.join(outputDir, relativePath.replace(/\.(jpg|jpeg|png)$/i, '.webp'));
          
          try {
            // Create output directory if it doesn't exist
            const outputDirPath = path.dirname(outputPath);
            if (!fs.existsSync(outputDirPath)) {
              fs.mkdirSync(outputDirPath, { recursive: true });
            }

            // Convert to WebP using cwebp (if available)
            execSync(`cwebp -q 80 "${file}" -o "${outputPath}"`, { stdio: 'ignore' });
            console.log(`✅ Converted to WebP: ${outputPath}`);
            convertedCount++;
          } catch (error) {
            console.log(`⚠️  Could not convert ${file} (cwebp not available)`);
          }
        }
      });

      console.log(`✅ Converted ${convertedCount} images to WebP format`);
    } catch (error) {
      console.error(`❌ Error converting images: ${error.message}`);
    }
  }

  findImageFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    
    list.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat && stat.isDirectory()) {
        results = results.concat(this.findImageFiles(filePath));
      } else {
        const ext = path.extname(file).toLowerCase();
        if (['.jpg', '.jpeg', '.png', '.gif'].includes(ext)) {
          results.push(filePath);
        }
      }
    });
    
    return results;
  }

  // Build process
  build() {
    console.log('🚀 Starting build optimization...\n');

    // Minify CSS
    console.log('📦 Minifying CSS files...');
    this.minifyCSS(
      path.join(this.projectRoot, 'style.css'),
      path.join(this.distDir, 'style.min.css')
    );
    
    if (fs.existsSync(path.join(this.srcDir, 'styles', 'main.css'))) {
      this.minifyCSS(
        path.join(this.srcDir, 'styles', 'main.css'),
        path.join(this.distDir, 'styles', 'main.min.css')
      );
    }

    // Minify JavaScript
    console.log('\n📦 Minifying JavaScript files...');
    const jsFiles = [
      'main.js',
      'testimonial-carousel.js',
      'lazy-loading.js',
      'analytics.js'
    ];

    jsFiles.forEach(file => {
      const inputPath = path.join(this.srcDir, 'scripts', file);
      if (fs.existsSync(inputPath)) {
        this.minifyJS(
          inputPath,
          path.join(this.distDir, 'scripts', file.replace('.js', '.min.js'))
        );
      }
    });

    // Convert images to WebP
    console.log('\n🖼️  Converting images to WebP...');
    this.convertToWebP(
      path.join(this.projectRoot, 'img'),
      path.join(this.distDir, 'img')
    );

    console.log('\n✅ Build optimization completed!');
    console.log('\n📝 Next steps:');
    console.log('1. Update HTML files to use minified CSS/JS');
    console.log('2. Add WebP image fallbacks');
    console.log('3. Configure server to serve optimized files');
  }
}

// Export for Node.js usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BuildOptimizer;
}

// Run if called directly
if (require.main === module) {
  const optimizer = new BuildOptimizer();
  optimizer.build();
}