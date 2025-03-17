function isPalindrome(phrase) {
    // Converte para minúsculas e remove espaços internos
    let cleanedPhrase = phrase.toLowerCase().replace(/\s/g, "");

    // Verifica se a string é igual à sua versão invertida
    return cleanedPhrase === cleanedPhrase.split("").reverse().join("");
}

console.log(isPalindrome("arara")); // true
console.log(isPalindrome("A base do teto desaba")); // true
console.log(isPalindrome("xpto")); // false
