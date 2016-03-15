class MarkdownRenderer < Redcarpet::Render::HTML

  def block_code(code, language)

    formatter = Rouge::Formatters::HTML.new(wrap: false)
    lexer = Rouge::Lexer.find('html')

    if /^block/.match language

      <<CODE
<div class="sg-codeExpContanier">
  <div class="sg-codeOutput">
    <div class="sg-codeOutput__blockPlacer">
      #{code}
    </div>
  </div>
  <div class="sg-codeBlock">
    <div class='highlight'><pre>#{formatter.format(lexer.lex(code))}</pre></div>
  </div>
</div>
CODE
    else
      if language.include?('js')
        lexer = Rouge::Lexer.find('javascript')
      elsif language.include?('html')
        lexer = Rouge::Lexer.find('html')
      elsif language.include?('css')
        lexer = Rouge::Lexer.find('css')
      else
        lexer = Rouge::Lexer.find_fancy('guess', code)
      end
      <<CODE
<div class="sg-codeExpContanier">
  <div class="sg-codeBlock">
    <div class='highlight'><pre>#{formatter.format(lexer.lex(code))}</pre></div>
  </div>
</div>
CODE
    end
  end

end
