const TOKENS = {
    INTEGER: 'INTEGER',
    PLUS: 'PLUS',
    MINUS: 'MINUS',
    EOF: 'EOF'
};


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
        while (this.current_char === " ")
            this.advance()

    }
    integer() {
        let result = '';

        while (Number(this.current_char)) {
            result += this.current_char
            this.advance()
        }

        return Number(result)
    }

    get_next_token() {
        while (this.current_char !== null) {
            if (this.current_char == " ") {
                this.skip_whitespace()
                continue
            }
            if (Number(this.current_char))
                return new Token(TOKENS.INTEGER, this.integer())

            if (this.current_char == '+') {
                this.advance()
                return new Token(TOKENS.PLUS, '+')
            }
            if (this.current_char == '-') {
                this.advance()
                return new Token(TOKENS.MINUS, '-')
            }
            this.error()
        }


        return new Token(TOKENS.EOF, null)
    }

    eat(token_type) {
        if (this.current_token.type == token_type)
            this.current_token = this.get_next_token()
        else
            this.error()
    }

    term(){
        this.eat(INTEGER)
    }
    expr() {
        let result;
        this.current_token = this.get_next_token()

        let left = this.current_token
        this.eat(TOKENS.INTEGER)
        let op = this.current_token;


        if (op.type == TOKENS.PLUS)
            this.eat(TOKENS.PLUS)
        else
            this.eat(TOKENS.MINUS)

        let right = this.current_token
        this.eat(TOKENS.INTEGER)

        if (op.type == TOKENS.PLUS)
            result = left.value + right.value
        else
            result = left.value - right.value

        return result;


    }
}

let interpreter = new Interpreter("9 - 5")
let result = interpreter.expr();
console.log(result)

