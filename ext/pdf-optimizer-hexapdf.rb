# frozen_string_literal: true

# copied from https://docs.asciidoctor.org/pdf-converter/latest/optimize-pdf/#compress-a-pdf
# cannot optimize using ghostscript due to https://bugs.ghostscript.com/show_bug.cgi?id=695760
require 'hexapdf/cli'

class Asciidoctor::PDF::Optimizer
  def initialize(*)
    app = HexaPDF::CLI::Application.new
    app.instance_variable_set :@force, true
    @optimize = app.main_command.commands['optimize']
  end

  def optimize_file path
    options = @optimize.instance_variable_get :@out_options
    options[:compress_pages] = true
    @optimize.execute path, path
    nil
  rescue
    # retry without page compression, which can sometimes fail
    options[:compress_pages] = false
    @optimize.execute path, path
    nil
  end
end
