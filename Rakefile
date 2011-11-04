require 'rake'
require 'rake/packagetask'
require 'yaml'

ROOT_DIR = File.expand_path(File.dirname(__FILE__))
SRC_DIR = File.join(ROOT_DIR, 'src')
DIST_DIR = File.join(ROOT_DIR,'dist')

DEBUG_DIR   = File.join(DIST_DIR, 'debug')
RELEASE_DIR = File.join(DIST_DIR, 'release')

DOCUMENTATION_DIR  = File.join(ROOT_DIR, 'doc')
PKG_DIR  = File.join(ROOT_DIR, 'pkg')

VERSION  = YAML.load(IO.read(File.join(SRC_DIR, 'constants.yml')))['VERSION']

TEST_DIR      = File.join(ROOT_DIR, 'test')
TEST_UNIT_DIR = File.join(TEST_DIR, 'unit')
TMP_DIR       = File.join(TEST_UNIT_DIR, 'tmp')

DOC_TEMPLATES_ROOT = File.join(ROOT_DIR, "templates")
DOC_TEMPLATES_DIR = File.join(DOC_TEMPLATES_ROOT, "html")

task :default => [:clean, :dist, :unified]

desc "Clean the distribution directory."
task :clean do 
  rm_rf DIST_DIR
  mkdir DIST_DIR
  mkdir DEBUG_DIR
  mkdir RELEASE_DIR
end

def dist_from_sources(sources)
  cp File.join(SRC_DIR,'delorean.js'), File.join(DIST_DIR,'delorean.js')
  cp File.join(ROOT_DIR,'lib','prototype.1.7.0.js'), File.join(DIST_DIR,'prototype.1.7.0.js')
  cp File.join(ROOT_DIR,'lib','raphael.2.0.0.js'), File.join(DIST_DIR,'raphael.2.0.0.js')
end

desc "Generates a minified version for distribution, using UglifyJS."
task :dist do
  cp File.join(SRC_DIR,'delorean.js'), File.join(DIST_DIR,'delorean.js')
  uglifyjs File.join(DIST_DIR,'delorean.js'), File.join(RELEASE_DIR,'delorean.min.js')
  process_minified File.join(DIST_DIR,'delorean.js'), File.join(RELEASE_DIR,'delorean.min.js')
  
  cp File.join(ROOT_DIR,'lib','prototype.1.7.0.js'), File.join(DIST_DIR,'prototype.1.7.0.js')
  uglifyjs File.join(DIST_DIR,'prototype.1.7.0.js'), File.join(RELEASE_DIR,'prototype.1.7.0.min.js')
  process_minified File.join(DIST_DIR,'prototype.1.7.0.js'), File.join(RELEASE_DIR,'prototype.1.7.0.min.js')
  
  cp File.join(ROOT_DIR,'lib','raphael.2.0.0.js'), File.join(DIST_DIR,'raphael.2.0.0.js')
  uglifyjs File.join(DIST_DIR,'raphael.2.0.0.js'), File.join(RELEASE_DIR,'raphael.2.0.0.min.js')
  process_minified File.join(DIST_DIR,'raphael.2.0.0.js'), File.join(RELEASE_DIR,'raphael.2.0.0.min.js')
 
end

def uglifyjs(src, target)
  begin
    require 'uglifier'
  rescue LoadError => e
    if verbose
      puts "\nYou'll need the 'uglifier' gem for minification. Just run:\n\n"
      puts "  $ gem install uglifier"
      puts "\nand you should be all set.\n\n"
      exit
    end
    return false
  end
  puts "Minifying #{src} with UglifyJS..."
  File.open(target, "w"){|f| f.puts Uglifier.new.compile(File.read(src))}
end

def process_minified(src, target)
  cp target, File.join(DIST_DIR,'temp.js')
  msize = File.size(File.join(DIST_DIR,'temp.js'))
  `gzip -9 #{File.join(DIST_DIR,'temp.js')}`

  osize = File.size(src)
  dsize = File.size(File.join(DIST_DIR,'temp.js.gz'))
  rm_rf File.join(DIST_DIR,'temp.js.gz')

  puts "Original version: %.3fk" % (osize/1024.0)
  puts "Minified: %.3fk" % (msize/1024.0)
  puts "Minified and gzipped: %.3fk, compression factor %.3f" % [dsize/1024.0, osize/dsize.to_f]
end

desc "Generate a unified minified version of Prototype, Raphael and Uncharted"
task :unified do
  unified = IO.read(File.join(DIST_DIR,'prototype.1.7.0.js')) + IO.read(File.join(DIST_DIR,'raphael.2.0.0.js')) + IO.read(File.join(DIST_DIR,'delorean.js'))
  File.open(File.join(DIST_DIR,'pro.raph.delorean.js'), 'w') do |file|
    file.write unified
  end 
  uglifyjs File.join(DIST_DIR,'pro.raph.delorean.js'), File.join(RELEASE_DIR,'pro.raph.delorean.min.js')
  process_minified File.join(DIST_DIR,'pro.raph.delorean.js'), File.join(RELEASE_DIR,'pro.raph.delorean.min.js')
  
end