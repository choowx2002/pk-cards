const base = import.meta.env.BASE_URL; 

export const keywordMap = {
  "Accelerate": `<span class='text-sm mr-2 px-2 py-0.5 rounded-lg text-white bg-red-700 w-fit' title='急速'>急速</span>`,
  "Ganking": `<span class='text-sm mr-2 px-2 py-0.5 rounded-lg text-white bg-red-700 w-fit' title='游走'>游走</span>`,

  "Assault": `<span class='text-sm mr-2 px-2 py-0.5 rounded-lg text-white bg-red-700 w-fit' title='强攻'>强攻</span>`,
  "Assault-2": `<span class='text-sm mr-2 px-2 py-0.5 rounded-lg text-white bg-red-700 w-fit' title='强攻 2'>强攻 2</span>`,
  "Assault-3": `<span class='text-sm mr-2 px-2 py-0.5 rounded-lg text-white bg-red-700 w-fit' title='强攻 3'>强攻 3</span>`,

  "Epic": `<span class='text-sm mr-2 px-2 py-0.5 rounded-lg text-white bg-[#8d7d33] w-fit' title='引导'>引导</span>`,
  "Deathknell": `<span class='text-sm mr-2 px-2 py-0.5 rounded-lg text-white bg-[#617cbe] w-fit' title='绝念'>绝念</span>`,
  "Tank": `<span class='text-sm mr-2 px-2 py-0.5 rounded-lg text-white bg-teal-600 w-fit' title='壁垒'>壁垒</span>`,
  "Legion": `<span class='text-sm mr-2 px-2 py-0.5 rounded-lg text-white bg-[#8d7d33] w-fit' title='鼓舞'>鼓舞</span>`,
  "Hidden": `<span class='text-sm mr-2 px-2 py-0.5 rounded-lg text-white bg-[#7962a9] w-fit' title='待命'>待命</span>`,
  "Reaction": `<span class='text-sm mr-2 px-2 py-0.5 rounded-lg text-white bg-[#7962a9] w-fit' title='反应'>反应</span>`,
  "Focused": `<span class='text-sm mr-2 px-2 py-0.5 rounded-lg text-white bg-[#426db1] w-fit' title='专注'>专注</span>`,

  "Deflect": `<span class='text-sm mr-2 px-2 py-0.5 rounded-lg text-white bg-teal-600 w-fit' title='法盾'>法盾</span>`,
  "Deflect-2": `<span class='text-sm mr-2 px-2 py-0.5 rounded-lg text-white bg-teal-600 w-fit' title='法盾 2'>法盾 2</span>`,
  "Deflect-3": `<span class='text-sm mr-2 px-2 py-0.5 rounded-lg text-white bg-teal-600 w-fit' title='法盾 3'>法盾 3</span>`,

  "Shield": `<span class='text-sm mr-2 px-2 py-0.5 rounded-lg text-white bg-teal-600 w-fit' title='坚守'>坚守</span>`,
  "Shield-2": `<span class='text-sm mr-2 px-2 py-0.5 rounded-lg text-white bg-teal-600 w-fit' title='坚守 2'>坚守 2</span>`,
  "Shield-3": `<span class='text-sm mr-2 px-2 py-0.5 rounded-lg text-white bg-teal-600 w-fit' title='坚守 3'>坚守 3</span>`,

  "Exhaust me": `<img src='${base}assets/images/exhaust.svg' alt='exhaust' title='消耗' class='w-[18px] mr-0.5 inline-block' />`,
  "might": `<img src='${base}assets/images/might.svg' alt='might' title='威力' class='w-[18px] mr-0.5 inline-block' />`,

  "energy-0": `<img src='${base}assets/images/energy-0.svg' alt='energy-0' title='法力 0' class='w-[18px] mx-0.5 inline-block' />`,
  "energy-1": `<img src='${base}assets/images/energy-1.svg' alt='energy-1' title='法力 1' class='w-[18px] mx-0.5 inline-block' />`,
  "energy-2": `<img src='${base}assets/images/energy-2.svg' alt='energy-2' title='法力 2' class='w-[18px] mx-0.5 inline-block' />`,
  "energy-3": `<img src='${base}assets/images/energy-3.svg' alt='energy-3' title='法力 3' class='w-[18px] mx-0.5 inline-block' />`,
  "energy-4": `<img src='${base}assets/images/energy-4.svg' alt='energy-4' title='法力 4' class='w-[18px] mx-0.5 inline-block' />`,
  "energy-5": `<img src='${base}assets/images/energy-5.svg' alt='energy-5' title='法力 5' class='w-[18px] mx-0.5 inline-block' />`,

  "Calm": `<img src='${base}assets/images/CALM.webp' alt='CALM' title='冷静' class='w-[18px] inline-block' />`,
  "Chaotic": `<img src='${base}assets/images/CHAOTIC.webp' alt='CHAOTIC' title='混沌' class='w-[18px] inline-block' />`,
  "Fury": `<img src='${base}assets/images/FURY.webp' alt='FURY' title='狂怒' class='w-[18px] inline-block' />`,
  "Mental": `<img src='${base}assets/images/MENTAL.webp' alt='MENTAL' title='心智' class='w-[18px] inline-block' />`,
  "Order": `<img src='${base}assets/images/ORDER.webp' alt='ORDER' title='秩序' class='w-[18px] inline-block' />`,
  "Physical": `<img src='${base}assets/images/PHYSICAL.webp' alt='PHYSICAL' title='物理' class='w-[18px] inline-block' />`,

  "new line": "<br>"
};


const replaceKeywords = (text) => {
    return text.split(/\[([^\]]+)\]/g).map((part, index) => {

        if (keywordMap[part]) {
            return (
                `${keywordMap[part]}`
            );
        }

        return `<span>${part.trim()}</span>`;
    }).join("");
};

export default replaceKeywords;