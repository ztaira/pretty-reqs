# pretty-reqs
Hack-a-Week 18: a plain text graph editor. The plain js version is in the
plainjs directory, and the react version components are in the react directory.

### Usage:
- Navigate to https://ztaira14.github.io/pretty-reqs/ to try it out
- Upload or paste in the contents of test.txt for a demonstration

### Features:
- Easy creation of complex node graphs via human-readable, human-editable plain text
- Share and save graphs easily via the upload/download buttons or copy/paste

### What it does:
- Parses the content of the text area
- Dynamically creates a node graph based on the text content
- Default values are `x=0`, `y=0`, `r=10`, and `color = (r < 24) ? 'silver' : 'grey'`

### What it doesn't do:
- Check that your provided values are valid
- Animate the graph

### Included Files:
```
- README.md..................This readme file
- plainjs/...................The plain javascript version
- react/.....................The react version components
- diagrams/..................Relevant diagrams and images
- tests.txt..................The intended functionality tests
```

### Example Output:
![alt text](https://github.com/ztaira14/pretty-reqs/blob/master/diagrams/prettyreqs.png "On Chrome")

### Why aren't there any automated tests?
- :(
