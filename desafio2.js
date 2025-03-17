function isPrimeNumber(number) {
    if (typeof number !== "number") return "Valor invalido detectado"

    if (number <= 1) return false // Números menores ou iguais a 1 não são primos
    if (number === 2) return true // 2 é o único número primo par
    if (number % 2 === 0) return false // Elimina números pares maiores que 2

    // Verifica divisibilidade apenas até a raiz quadrada de number
    const limit = Math.sqrt(number)

    for (let i = 3; i <= limit; i += 2) {
        // Se for divisível, não é primo
        if (number % i === 0) return false
    }

    // Se não encontrou divisores, o número é primo
    return true
}

console.log(isPrimeNumber(7))  // true
console.log(isPrimeNumber(10)) // false
console.log(isPrimeNumber("a")) // O argumento precisa ser um número

