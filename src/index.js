// eslint-disable-next-line no-unused-vars
function toggleAddFlower() {
    clearValidation();
    toggleContainer('addFlowerContainer');
}

function toggleContainer(containerName) {
    const elementsByClassName = document.getElementById(containerName);
    if (elementsByClassName.className.endsWith('show')) {
        elementsByClassName.classList.remove('show');
    } else {
        elementsByClassName.classList.add('show');
    }
}

function clearValidation() {
    document.getElementById('showValidation').innerText = '';
}

// eslint-disable-next-line no-unused-vars
async function addFlower() {
    clearValidation();
    const flower = createFlower();
    if (isInvalid(flower)) {
        handleInvalidFlower();
        return;
    }
    await sendValidFlower(flower);
    if (!shouldLoadFlowers()) {
        await fetchFlowers();
    }
}

function createFlower() {
    return {
        name: document.getElementById('addFlowerName').value,
        category: document.getElementById('addFlowerCategory').value,
        stemColor: document.getElementById('addFlowerStemColor').value,
        stemHeight: document.getElementById('addFlowerStemHeight').value,
        stemWidth: document.getElementById('addFlowerStemWidth').value,
        stemThrones: document.getElementById('addFlowerStemThrones').checked,
        petalColor: document.getElementById('addFlowerPetalColor').value,
        petalHeight: document.getElementById('addFlowerPetalHeight').value,
        petalWidth: document.getElementById('addFlowerPetalWidth').value,
        petalThrones: document.getElementById('addFlowerPetalThrones').checked
    };
}

function isInvalid(flower) {
    const isEmpty = flower.name === '' || flower.category === '';
    const isToLow = flower.stemWidth < 1 || flower.stemHeight < 1 || flower.petalWidth < 1 || flower.petalHeight < 1;
    const isToHigh = (parseInt(flower.stemHeight) + parseInt(flower.petalHeight) / 2) > 11;
    return isEmpty || isToLow || isToHigh;
}

const handleInvalidFlower = () => editFlowerStatus('Invalid Flower', 'red');

function editFlowerStatus(text, color) {
    const element = document.getElementById('showValidation');
    element.innerText = text;
    element.style.color = color;
}

async function sendValidFlower(flower) {
    await fetch('http://localhost:8081/flower', {
        method: 'POST',
        body: JSON.stringify(flower),
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json; charset=UTF-8'
        }
    }).catch(error => console.log(error));
    editFlowerStatus('valid Flower', 'green');
}

// eslint-disable-next-line no-unused-vars
async function toggleOverviewFlower() {
    if (shouldLoadFlowers()) {
        await fetchFlowers();
    }
    toggleContainer('overviewFlowerContainer');
}

const shouldLoadFlowers = () => !document.getElementById('overviewFlowerContainer').className.endsWith('show');

async function fetchFlowers() {
    await flowersGETAndLoading('http://localhost:8081/flower');
}

async function flowersGETAndLoading(URL) {
    await fetch(URL)
        .then(result => result.json())
        .then(flowers => loadFlowers(flowers))
        .catch(error => console.error(error));
}

function loadFlowers(flowers) {
    addSearchAction();
    const flowerFlexbox = document.getElementById('overviewFlowerFlexbox');
    removeAllChildren(flowerFlexbox);
    flowers.forEach(f => flowerFlexbox.appendChild(constructFlower(f)));
}

function removeAllChildren(element) {
    while (element.firstChild) {
        element.removeChild(element.lastChild);
    }
}

// eslint-disable-next-line no-unused-vars
async function fetchSortedFlowers() {
    const reverse = document.getElementById('reverseSorting').checked;
    const URL = 'http://localhost:8081/flower/sort/' + fetchSorting() + (reverse ? '/true' : '');
    document.getElementById('searchFlower').value = '';
    await flowersGETAndLoading(URL);
}

function fetchSorting() {
    const options = document.getElementById('searchFlower').parentNode.childNodes[5].childNodes[5].childNodes;
    for (const sort of options) {
        if (sort.selected && sort.textContent !== 'Sort by') {
            return sort.textContent.replace(' ', '');
        }
    }
}

function addSearchAction() {
    document.getElementById('searchFlower').addEventListener('input', function(event) {
        const search = event.target.value;
        const flowers = document.getElementsByClassName('flower');
        for (const flower of flowers) {
            const name = flower.childNodes[3].childNodes[4].textContent.split('-')[1];
            flower.style.display = name.startsWith(search) ? 'block' : 'none';
        }
    });
}

function constructFlower(flower) {
    const properties = constructProperties(flower);
    const flowerHtml = getFlowerTemplate().childNodes.item(1);
    const flowerProperties = flowerHtml.querySelector('.flowerPropertiesOverview');
    addActionListenerToFlower(flowerHtml);
    addStyling(flower, flowerHtml);
    properties.forEach(property => flowerProperties.appendChild(property));
    return flowerHtml;
}

function constructProperties(flower) {
    const properties = [];
    Object.keys(flower).forEach((key) => properties.push([key, flower[key]]));
    const constructedProperties = [];
    properties.forEach(property => constructedProperties.push(constructProperty(property)));
    return constructedProperties;
}

const constructProperty = (property) => {
    const div = document.createElement('div');
    const description = document.createElement('p');
    description.textContent = property[0] + '-';
    const content = document.createElement('p');
    content.textContent = property[1];
    content.style.fontWeight = 'bold';
    if (property[0].endsWith('Color')) {
        content.style.backgroundColor = property[1];
        content.style.borderRadius = '3px';
    }
    div.appendChild(description);
    div.appendChild(content);
    div.classList.add('flowerProperty', 'defaultBorderBackgroundShadow');
    return div;
};

const getFlowerTemplate = () => document.getElementById('flowerTemplate').content.cloneNode(true);

function addActionListenerToFlower(flowerHtml) {
    addIncreaseCounterActionListener(flowerHtml);
    addDecreaseCounterActionListener(flowerHtml);
    addDeleteActionsListener(flowerHtml);
}

function addIncreaseCounterActionListener(flowerHtml) {
    flowerHtml.querySelector('.add').onclick = function() {
        this.parentNode.childNodes[3].textContent = parseInt(this.parentNode.childNodes[3].textContent) + 1;
    };
}

function addDecreaseCounterActionListener(flowerHtml) {
    flowerHtml.querySelector('.remove').onclick = function() {
        const value = this.parentNode.childNodes[3];
        if (parseInt(value.textContent) > 1) {
            value.textContent = parseInt(value.textContent) - 1;
        } else {
            value.textContent = 0;
        }
    };
}

function addDeleteActionsListener(flowerHtml) {
    flowerHtml.querySelector('.delete').onclick = function() {
        const id = getIDOfFlower(this.parentNode.parentNode);
        const overview = this.parentNode.parentNode.parentNode;
        for (const element of overview.childNodes) {
            if (getIDOfFlower(element) === id) {
                overview.removeChild(element);
            }
        }
        deleteFlowerByID(id);
    };
}

const getIDOfFlower = (node) => node.childNodes[3].childNodes[3].childNodes[1].textContent;

function deleteFlowerByID(id) {
    fetch('http://localhost:8081/flower/' + id, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json; charset=UTF-8'
        }
    }).catch(error => console.log(error));
}

function addStyling(flower, flowerHtml) {
    const flowerStem = flowerHtml.querySelector('.flowerStem');
    const height = (flower.stemHeight >= 10) ? 90 : flower.stemHeight * 10;
    const width = (flower.stemWidth >= 10) ? 36 : flower.stemWidth * 4;
    addStylingToHtmlElement(flowerStem, width, height, flower.stemColor);
    const flowerPetal = flowerHtml.querySelector('.flowerPetal');
    const petalHeight = (flower.petalHeight >= 10) ? 27 : flower.petalHeight * 3;
    const petalWidth = (flower.petalWidth >= 10) ? 50 : flower.petalWidth * 8;
    addStylingToHtmlElement(flowerPetal, petalWidth, petalHeight, flower.petalColor);
    flowerPetal.style.marginTop = (-height - petalHeight) + '%';
    if (flower.stemThrones) {
        addThrones(flowerHtml, flower.stemColor);
    }
    if (flower.petalThrones) {
        addPetalThrones(flowerHtml, flower.petalColor);
    }
}

function addStylingToHtmlElement(element, width, height, color) {
    element.style.height = height + '%';
    element.style.width = width + '%';
    element.style.marginTop = 98 - height + '%';
    element.style.marginLeft = 50 - (width / 2) + '%';
    element.style.backgroundColor = color;
    element.style.border = '2px solid ' + createDarkBorder(color);
    element.style.borderRadius = '10px';
}

function createDarkBorder(color) {
    const hex = color.replace('#', '');
    return '#' + darkerValue(hex.substring(0, 2)) + darkerValue(hex.substring(2, 4)) + darkerValue(hex.substring(4, 6));
}

function darkerValue(stringValue) {
    const value = parseInt(stringValue, 16);
    return Math.max(value - 20, 0).toString(16);
}

function addThrones(flowerHtml, color) {
    const throneRightUp = flowerHtml.querySelector('.throneRightUp');
    const throneRightDown = flowerHtml.querySelector('.throneRightDown');
    throneRightUp.style.borderBottom = '0.5vw solid ' + createDarkBorder(color);
    throneRightDown.style.borderLeft = '0.5vw solid ' + createDarkBorder(color);
}

function addPetalThrones(flowerHtml, color) {
    const throneTopLeft = flowerHtml.querySelector('.throneTop');
    throneTopLeft.style.borderBottom = '0.5vw solid ' + createDarkBorder(color);
}

// eslint-disable-next-line no-unused-vars
function generateFlowerMeadow() {
    const flowers = document.getElementsByClassName('flower');
    const flowerMeadow = document.getElementsByClassName('flowerMeadow')[0];
    removeAllChildren(flowerMeadow);
    for (const flower of flowers) {
        addFlowerToMeadow(flower.cloneNode(true), flowerMeadow);
    }
    shuffleChildren(flowerMeadow);
}

function addFlowerToMeadow(flower, flowerMeadow) {
    const flowerCounter = flower.childNodes[5].childNodes[3].textContent;
    const flowerUI = flower.childNodes[1];
    overrideStyle(flowerUI);
    appendToMeadow(flowerCounter, flowerMeadow, flowerUI);
}

function overrideStyle(flowerUI) {
    flowerUI.style.border = 'none';
    flowerUI.style.boxShadow = 'none';
    flowerUI.style.margin = '-0.5vw';
    flowerUI.style.marginLeft = '-3vw';
}

function appendToMeadow(flowerCounter, flowerMeadow, flowerUI) {
    while (flowerCounter > 0) {
        flowerMeadow.appendChild(flowerUI.cloneNode(true));
        flowerCounter--;
    }
}

function shuffleChildren(flowerMeadow) {
    for (let i = flowerMeadow.children.length; i >= 0; i--) {
        flowerMeadow.appendChild(flowerMeadow.children[Math.random() * i | 0]);
    }
}
