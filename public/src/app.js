
document.querySelector("input").addEventListener("blur", hasValue)
document.querySelector("input").addEventListener("input", searchData)
document.querySelector(".clear").addEventListener("click", clearAll)
document.querySelector(".expand").addEventListener("click", expandMinimize)

function expandMinimize() {
    const elementToControl = this.closest("[aria-expanded]")
    elementToControl.ariaExpanded = flipStringBoolean(elementToControl.ariaExpanded)
}

function flipStringBoolean(string) {
    return string.toLowerCase() === "false"
}

function hasValue() {
    const wrapper = document.querySelector(".inputWrapper")
    if (this.value) wrapper.dataset.datawithin = "true"
    else wrapper.dataset.datawithin = "false"
}

async function searchData() {
    const { value } = this
    if (!value) {
        clearResultsElement()
        return
    }

    const response = await fetch(`/search?begrepp=${value}`)
    const found = await response.json()

    updateResults(found)
}

function updateResults(found) {
    clearResultsElement()

    if (found.length === 0) {
        const resultsElement = document.querySelector(".results")
        const noResults = quickCreateElement("li", "noResults")

        const noResultsText = quickCreateElement("span")
        noResultsText.innerText = `Kunde tyvärr inte hitta några resultat`

        noResults.append(noResultsText)
        resultsElement.append(noResults)
        return
    }

    for (let package of found) {
        createLi(package)
    }
}

function createLi(package) {
    const resultsElement = document.querySelector(".results")
    const { abbreviation, meanings, exact } = package

    const liElement = quickCreateElement("li")
    if (exact) liElement.dataset.exact = "true"

    const abbreviationElement = quickCreateElement("h2")
    abbreviationElement.textContent = abbreviation

    liElement.append(abbreviationElement)
    for (let meaning of meanings) {
        const matchElement = createMatchElements(abbreviation, meaning)
        liElement.append(matchElement)
    }

    exact ? resultsElement.prepend(liElement) : resultsElement.append(liElement)

}

function createMatchElements(abbreviation, { meaning, explanation, info, usage }) {
    const matchElement = quickCreateElement("div", "match")
    if (!usage[0]) matchElement.dataset.general = "true"

    const usedbyElement = createUsedbyElement(usage)

    const meaningElement = quickCreateElement("div", "meaning")
    meaningElement.textContent = meaning || abbreviation

    const explanationElement = quickCreateElement("div", "explanation")
    explanationElement.innerText = explanation

    const moreInfoElement = quickCreateElement("div", "moreInfo")
    const moreInfoA = quickCreateElement("a")
    moreInfoA.href = info.link || "#"
    moreInfoA.target = "_blank"
    moreInfoA.textContent = "mer information"

    moreInfoElement.append(moreInfoA)

    matchElement.append(usedbyElement, meaningElement, explanationElement, moreInfoElement)

    return matchElement
}

function createUsedbyElement(users) {
    const container = quickCreateElement("div", "usedby")
    const usageList = quickCreateElement("ul")

    for (let user of users) {
        if (!user) continue
        const userLi = quickCreateElement("li")
        userLi.textContent = user
        userLi.dataset.user = user.toLowerCase()
        usageList.append(userLi)
    }

    container.append(usageList)
    return container
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

function quickCreateElement(type, className) {
    const newElement = document.createElement(type)
    if (className) newElement.classList.add(className)
    return newElement
}