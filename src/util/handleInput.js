
async function textAreaSpace(textString) {
    const lines = textString.split('\n');
    const Text = lines.map(line => {

            if(line.trim().length !==0) {
                return  {descText:line.trim(""),emoji:'✔️'}
            }
    })
    const newText = Text.filter(line =>  line)
    return newText;
}
async function inputSpace(textString) {
    const lines = textString.split(' ');
    return lines;

}

module.exports = { textAreaSpace,inputSpace };
