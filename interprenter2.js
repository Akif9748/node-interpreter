const TOKENS = {
    INTEGER: 'INTEGER',
    PLUS: 'PLUS',
    MINUS: 'MINUS',
    EOF: 'EOF',
    DIV: 'DIV',
    MULTI: 'MULTI'
};

String.prototype.isspace = function () {
    return this === " ";
}
String.prototype.isdigit = function () {
    return Number(this) || (Number(this) === 0 && !this.isspace());
}

class Token {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }

    toString() {
        return `Token(${this.type}, ${this.value})`;
    }

}

class Interpreter {
    constructor(text) {
        this.text = text
        this.pos = 0
        this.current_token = null
        this.current_char = this.text[this.pos]

    }

    /**********************************
     ********** LEXER CODE ************
     **********************************/
    error() {
        throw Error('Error parsing input')
    }

    advance() {
        this.pos++;
        if (this.pos > this.text.length - 1)
            this.current_char = null
        else
            this.current_char = this.text[this.pos]
    }
    skip_whitespace() {
        while (this.current_char?.isspace())
            this.advance()

    }
    integer() {
        let result = '';

        while (this.current_char?.isdigit()) {
            result += this.current_char
            this.advance()
        }

        return Number(result)
    }

    get_next_token() {
        while (this.current_char !== null) {
            if (this.current_char?.isspace()) {
                this.skip_whitespace()
                continue
            }
            if (this.current_char?.isdigit())
                return new Token(TOKENS.INTEGER, this.integer())

            if (this.current_char == '+') {
                this.advance()
                return new Token(TOKENS.PLUS, '+')
            }
            if (this.current_char == '-') {
                this.advance()
                return new Token(TOKENS.MINUS, '-')
            }
            if (this.current_char == '/') {
                this.advance()
                return new Token(TOKENS.DIV, '/')
            }
            if (this.current_char == '*') {
                this.advance()
                return new Token(TOKENS.MULTI, '*')
            }
            this.error()
        }


        return new Token(TOKENS.EOF, null)
    }


    /**********************************
     ****** PARSER / INTERPRETER ******
     **********************************/
    eat(token_type) {
        if (this.current_token.type == token_type)
            this.current_token = this.get_next_token()
        else
            this.error()
    }

    term() {

        let token = this.current_token;
        this.eat(TOKENS.INTEGER);
        return token.value;

    }
    expr() {
        this.current_token = this.get_next_token()
        let result = this.term()

        while (this.current_token.type in TOKENS) {
            let token = this.current_token

            if (token.type == TOKENS.EOF) break;

            this.eat(token.type);

            switch (token.type) {
                case TOKENS.PLUS:
                    result = result + this.term();
                    break;
                case TOKENS.MINUS:
                    result = result - this.term();
                    break;
                case TOKENS.DIV:
                    result = result / this.term();
                    break;

                case TOKENS.MULTI:
                    result = result * this.term();
                    break;

                default:
                    break;
            }

        }
        return result;


    }
}

let interpreter = new Interpreter("1 / 8 * 8 + 32 - 64 + 8 * 8");
let result = interpreter.expr();
console.log(result)

