
document.querySelector("input").addEventListener("keyup", searchData)

function searchData() {
    const { value } = this
    if (!value) {
        clearResultsElement()
        return
    }
    const valueRegex = new RegExp(`^${value}`, "i")
    const found = []
    for (let abbreviation in wordlist) {
        if (valueRegex.test(abbreviation)) {
            const package = {
                abbreviation,
                explanation: wordlist[abbreviation]
            }
            found.push(package)
        }
    }
    updateResults(found)
}

function updateResults(found) {
    // EV bara visa matchningar och om det är mer än en måste man klicka för att se förklaring
    clearResultsElement()
    for (let package of found) {
        createLi(package)
    }
}

function createLi(package) {
    const { abbreviation, explanation } = package

    const resultsElement = document.querySelector(".results")

    const liElement = document.createElement("li")

    const abbreviationElement = document.createElement("h1")
    abbreviationElement.classList.add("abbreviation")
    abbreviationElement.textContent = abbreviation

    const explanationElement = document.createElement("p")
    explanationElement.classList.add("explanation")
    explanationElement.innerText = explanation

    liElement.append(abbreviationElement, explanationElement)
    resultsElement.append(liElement)
}

function clearResultsElement() {
    const resultsElement = document.querySelector(".results")
    const children = [...resultsElement.children]
    for (let child of children) {
        child.remove()
    }
}