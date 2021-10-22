const canvas = document.getElementById('cont');
canvas.addEventListener("click", (e => {drawCircle(e.pageX, e.pageY)}))
const SCALE = 100
const DAMPING_FACTOR = 0.85
const svgns = "http://www.w3.org/2000/svg";

let nodes = []
let edges = []
let pageRankValues = []

clickedCircle = null 
function circleClicked(elem) {
    if(clickedCircle) { // Checking if another circle has already been clicked
        edges.push([clickedCircle.id,elem.id])
        drawLine(clickedCircle, elem)
        clickedCircle = null
    } else {
        clickedCircle = elem // Saving first clicked circle
    }
}


function recalculateNodesWeight() {
    for(let i=0; i<nodes.length; i++) {
        pageRankValues[nodes[i].id] = null
    }
    for(let i=0; i<nodes.length; i++) {
        let nodeElement = nodes[i]
        let pageRankValue = getPageRankOfNode(nodeElement.id)
        console.log(nodeElement.id, pageRankValue)
        nodeElement.setAttribute('r', pageRankValue*SCALE);
    }
}

function getPageRankOfNode(elemId) {
    let pageRankValue = pageRankValues[elemId]
    if(!pageRankValue) {
        pageRankValue = 1 / nodes.length // Setting initial distribution
        getNodesLinkingTo(elemId).forEach(node => { // Implementation of the Simplified algorithm (https://en.wikipedia.org/wiki/PageRank#Simplified_algorithm)
            pageRankValue += getPageRankOfNode(node) / getNumberOfLinksFromNode(node)
        })
        pageRankValues[elemId] = pageRankValue
    }
    
    return pageRankValue
}

function getNodesLinkingTo(elemId) {
    let nodes = []
    edges.forEach(edge => {
        if(edge[1] == elemId) {
            nodes.push(edge[0])
        }
    })
    return nodes
}

function getNumberOfLinksFromNode(elemId) {
    let n = 0
    edges.forEach(edge => {
        if(edge[0] == elemId) {
            n++
        }
    })
    return n
}



// DRAWING

function drawCircle(x, y) {
    let container = document.getElementById('cont');
    let circle = document.createElementNS(svgns, 'circle');
    circle.setAttributeNS(null, 'cx', x);
    circle.setAttributeNS(null, 'cy', y);
    circle.setAttributeNS(null, 'r', 30);
    circle.setAttributeNS(null, 'style', 'fill: #777; stroke: black; stroke-width: 3px;');
    circle.id = nodes.length
    clickedCircle = null
    circle.addEventListener("click", (event) => {
        event.cancelBubble = true
        event.stopPropagation()
        circleClicked(circle)
    })
    container.appendChild(circle);
    nodes.push(circle)
    recalculateNodesWeight()
}
function drawLine(a, b) {
    let container = document.getElementById('cont');
    let line = document.createElementNS(svgns, 'line');
    line.setAttributeNS(null, 'x1', a.cx.baseVal.value);
    line.setAttributeNS(null, 'y1', a.cy.baseVal.value);
    line.setAttributeNS(null, 'x2', b.cx.baseVal.value);
    line.setAttributeNS(null, 'y2', b.cy.baseVal.value);
    line.setAttributeNS(null, 'marker-end', "url(#arrowhead)");
    line.setAttributeNS(null, 'style', 'stroke: black; stroke-width: 3px; marker-end="url(#arrowhead)"' );
    container.appendChild(line);
    recalculateNodesWeight()
}