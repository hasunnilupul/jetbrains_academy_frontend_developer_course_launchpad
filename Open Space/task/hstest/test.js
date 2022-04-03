const puppeteer = require('puppeteer');
const path = require('path');
// '..' since we're in the test/ subdirectory; learner is supposed to have src/index.html
const pagePath = 'file://' + path.resolve(__dirname, '../src/index.html');

const hs = require('hs-test-web');

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

async function stageTest() {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args:['--start-maximized']
    });

    const page = await browser.newPage();
    await page.goto(pagePath);

    page.on('console', msg => console.log(msg.text()));

    await sleep(1000);

    let result = await hs.testPage(page,
        //#test1
        //testing structure of the page
        () => {
            let body = document.getElementsByTagName("body")[0];
            if (!(body.children.length === 1 &&
                body.children[0].tagName.toLowerCase() === 'div' &&
                body.children[0].className === 'space')
            ) return hs.wrong("There are some mismatches with suggested structure or naming")

            let space = body.children[0];
            if (!(space.children.length === 1 &&
                space.children[0].tagName.toLowerCase() === 'div' &&
                space.children[0].className === 'planet-area')
            ) return hs.wrong("There are some mismatches with suggested structure or naming")

            let planetArea = space.children[0];
            if (!(planetArea.children.length === 2 &&
                planetArea.children[0].tagName.toLowerCase() === 'img' &&
                planetArea.children[1].tagName.toLowerCase() === 'img' && (
                    planetArea.children[0].className === 'planet' && planetArea.children[1].className === 'rocket' ||
                    planetArea.children[1].className === 'planet' && planetArea.children[0].className === 'rocket'))
            ) return hs.wrong("There are some mismatches with suggested structure or naming")

            return hs.correct()
        },
        //#test2
        //testing background
        () => {
            let space = document.body.getElementsByClassName("space");
            if (space.length === 0) return hs.wrong("There no element with class='space'");

            let spaceBg = window.getComputedStyle(space[0]).backgroundImage;
            if (!spaceBg) return  hs.wrong("The element with class='space' should have background-image.");

            return hs.correct();
        },
        //#test3
        //rocket should be above the planet
        () => {
            const planet = document.body.getElementsByClassName("planet");
            const rocket = document.body.getElementsByClassName("rocket");

            if (planet.length === 0) return hs.wrong("There no element with class='planet'");
            if (rocket.length === 0) return hs.wrong("There no element with class='rocket'");

            const planetTop = parseInt(window.getComputedStyle(planet[0]).top);
            const rocketTop = parseInt(window.getComputedStyle(rocket[0]).top);

            if (planetTop > rocketTop + 300) return  hs.wrong("The rocket element is placed too low");

            return hs.correct();
        }
    )

    await browser.close();
    return result;
}

jest.setTimeout(30000);
test("Test stage", async () => {
        let result = await stageTest();
        if (result['type'] === 'wrong') {
            fail(result['message']);
        }
    }
);
