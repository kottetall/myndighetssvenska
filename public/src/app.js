
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
        // FIXME: Skiv om!
        if (valueExactRegex.test(abbreviation)) {
            const package = wordlist[abbreviation][0] //TODO Anpassa för flera förklaringar
            package.abbreviation = abbreviation
            package.exact = true

            found.push(package)
        } else if (valuePartialRegex.test(abbreviation)) {
            const package = wordlist[abbreviation][0] //TODO Anpassa för flera förklaringar
            package.abbreviation = abbreviation
            package.exact = false

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
    const { abbreviation, meaning, explanation, info, usage, exact } = package

    const resultsElement = document.querySelector(".results")

    const liElement = document.createElement("li")

    const abbreviationElement = document.createElement("div")
    abbreviationElement.classList.add("abbreviation")
    abbreviationElement.textContent = abbreviation

    const meaningElement = document.createElement("div")
    meaningElement.classList.add("meaning")
    meaningElement.textContent = meaning || abbreviation

    const explanationElement = document.createElement("div")
    explanationElement.classList.add("explanation")
    explanationElement.textContent = explanation || ""

    const infoElement = document.createElement("div")
    infoElement.classList.add("moreinfo")
    const infoLink = document.createElement("a")
    infoLink.href = info.link || "#"
    infoLink.target = "_blank"
    infoLink.rel = "noopener noreferrer"
    infoLink.textContent = "mer information"

    infoElement.append(infoLink)


    const usedbyElement = document.createElement("div")
    usedbyElement.classList.add("usedby")
    const usedbyLink = document.createElement("a")
    usedbyLink.href = usage.link || "#"
    usedbyLink.target = "_blank"
    usedbyLink.rel = "noopener noreferrer"
    usedbyLink.textContent = usage.name || "okänd"

    usedbyElement.textContent = "används av: "
    usedbyElement.append(usedbyLink)



    liElement.append(abbreviationElement, meaningElement, explanationElement, infoElement, usedbyElement)

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