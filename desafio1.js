function sumArrayElements(arr) {
    if (!Array.isArray(arr)) {
        return "O argumento passado não é um array"
    }

    if (arr.some(item => typeof item !== 'number')) {
        return "Valor invalido detectado"
    }

    return arr.reduce((acc, curr) => acc + curr, 0)
}

console.log(sumArrayElements([1, 2, 3, 4])) // 10

console.log(sumArrayElements([1, 2, 3, '4'])) // O array passado contém elementos que não são números

console.log(sumArrayElements('1, 2, 3, 4')) // O argumento passado não é um array