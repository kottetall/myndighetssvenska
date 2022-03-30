
document.querySelector("input").addEventListener("keyup", searchData)
document.querySelector(".clear").addEventListener("click", clearAll)

function searchData() {
    const { value } = this
    if (!value) {
        clearResultsElement()
        return
    }

    const valueExactRegex = new RegExp(`^${value}$`, "i")
    const valuePartialRegex = new RegExp(`^${value}`, "i")
    const valueSuggestRegex = new RegExp(`^${value.substring(0, value.length - 1)}.`, "i")

    const found = []
    for (let abbreviation in wordlist) {
        if (valueExactRegex.test(abbreviation)) {
            const package = {
                abbreviation,
                explanation: wordlist[abbreviation],
                exact: true
            }
            found.push(package)
        } else if (valuePartialRegex.test(abbreviation)) {
            const package = {
                abbreviation,
                explanation: wordlist[abbreviation],
                exact: false
            }
            found.push(package)
        } else if (value.length > 1 && valueSuggestRegex.test(abbreviation)) {
            // TODO: visa förslag
            console.clear()
            console.log(`förslag: ${abbreviation}`)
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
    const { abbreviation, explanation, exact } = package

    const resultsElement = document.querySelector(".results")

    const liElement = document.createElement("li")
    if (exact) liElement.classList.add("exact")

    const abbreviationElement = document.createElement("h1")
    abbreviationElement.classList.add("abbreviation")
    abbreviationElement.textContent = abbreviation

    const explanationElement = document.createElement("p")
    explanationElement.classList.add("explanation")
    explanationElement.innerText = explanation

    liElement.append(abbreviationElement, explanationElement)


    exact ? resultsElement.prepend(liElement) : resultsElement.append(liElement)

}

function clearResultsElement() {
    const resultsElement = document.querySelector(".results")
    const children = [...resultsElement.children]
    for (let child of children) {
        child.remove()
    }
}

function clearAll() {
    clearResultsElement()
    const input = document.querySelector("#inputAbbreviation")
    input.value = ""
    input.focus()
}