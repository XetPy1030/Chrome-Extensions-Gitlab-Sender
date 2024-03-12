import {MATTERMOST_CHANNEL, MATTERMOST_TOKEN, STORM_CODE_REVIEW_ID, STORM_SPACE, STORM_TOKEN, USERNAME} from "./consts";

const header = document.querySelector('.detail-page-header-body')


function generateTextHeader() {
    let childNodes = header.children[0].childNodes

    let text = ''

    for (let i = 0; i < childNodes.length; i++) {
        const node = childNodes[i];

        // Проверить, является ли узел элементом <a>
        if (node.tagName === 'A') {
            text += `[${node.textContent}](${node.getAttribute("href")}) `
        }

        // Проверить, является ли узел текстовым узлом
        if (node.nodeType === Node.TEXT_NODE) {
            if (!node.textContent.trim()) {
                continue;
            }
            text += `${node.textContent.trim()} `
        }
    }
    return text
}

function getTNSText() {
    let childNodes = header.children[0].childNodes

    let text = ''

    for (let i = 0; i < childNodes.length; i++) {
        const node = childNodes[i];

        // Проверить, является ли узел элементом <a>
        if (node.tagName === 'A') {
            const link = node.getAttribute("href");
            if (link.startsWith('https://storm.alabuga.space/tasks/item/')) {
                text = link.split('/').pop()
            }
        }
    }
    return text
}


const newButton = document.createElement('button')
newButton.textContent = 'SEND MR'

let message = `@${USERNAME} `
message += `[MR](${window.location.href}) ${generateTextHeader()}`


newButton.onclick = async () => {
    const responseMatter = await fetch('https://chat.alabuga.space/api/v4/posts', {
        method: "POST",
        body: JSON.stringify({
            message: message,
            channel_id: MATTERMOST_CHANNEL
        }),
        headers: {
            Authorization: `Bearer ${MATTERMOST_TOKEN}`,
        },
    })
    if (!responseMatter.ok) {
        alert('Error sending message')
    }

    const TNS = getTNSText()
    if (TNS) {
        const responseStorm1 = await fetch(`https://storm.alabuga.space/tasks/api/v1/tenants/${STORM_SPACE}/workitems/${TNS}`, {
            headers: {
                Authorization: STORM_TOKEN
            }
        })
        if (!responseStorm1.ok) {
            alert('Error getting task')
        }
        const data = await response.json()
        const workItemId = data.workitemId
        const responseStorm2 = await fetch(`https://storm.alabuga.space/tasks/api/v1/tenants/${STORM_SPACE}/workitems/${workItemId}`, {
            method: "PATCH",
            body: JSON.stringify({
                statusId: STORM_CODE_REVIEW_ID
            }),
            headers: {
                Authorization: STORM_TOKEN,
                'Content-Type': 'application/json'
            }
        })
        if (!responseStorm2.ok) {
            alert('Error updating task')
        }
    }
}
header.appendChild(newButton)

// alert(header.textContent)
