
// document.querySelector("input").addEventListener("keyup", searchData)
document.querySelector("input").addEventListener("blur", hasValue)
document.querySelector("input").addEventListener("input", searchData)
document.querySelector(".clear").addEventListener("click", clearAll)

function hasValue() {
    const wrapper = document.querySelector(".inputWrapper")
    if (this.value) wrapper.dataset.datawithin = "true"
    else wrapper.dataset.datawithin = "false"
}

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
            const package = { meanings: wordlist[abbreviation] } //TODO Anpassa för flera förklaringar
            package.abbreviation = abbreviation
            package.exact = true

            found.push(package)
        } else if (valuePartialRegex.test(abbreviation)) {
            const package = { meanings: wordlist[abbreviation] } //TODO Anpassa för flera förklaringar
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
    explanationElement.textContent = explanation

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