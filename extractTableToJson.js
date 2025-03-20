function extractTableToJson() {
  let suiteElement = document.querySelector('.suite');
  if (!suiteElement) {
    console.error("Elemento com a classe 'suite' não encontrado.");
    return;
  }

  let testCases = [];
  let suiteName = suiteElement.querySelector('.name')?.innerText.trim() || 'Unknown Suite';
  let suiteMetadataTable = suiteElement.querySelector('table.metadata tbody');
  let suiteMetadata = {};

  if (suiteMetadataTable) {
    let rows = suiteMetadataTable.querySelectorAll('tr');
    rows.forEach((row) => {
      let th = row.querySelector('th');
      let td = row.querySelector('td');
      if (th && td) {
        let key = th.innerText
          .trim()
          .replace(/[^a-zA-Z0-9]+/g, ' ')
          .replace(/ (.)/g, (match, group) => group.toUpperCase())
          .replace(/^./, (match) => match.toLowerCase());
        let value = td.innerText.trim();
        if (!th.innerText.includes('Expand All')) {
          suiteMetadata[key] = value;
        }
      }
    });
  }

  let testElements = suiteElement.querySelectorAll('.test');
  testElements.forEach((test) => {
    let testCase = {};
    let testCasePath =
      test.querySelector('.element-header .name')?.innerText.trim() || 'Unknown/Test Case';
    testCase['testCaseTitle'] = testCasePath.split('/').pop();

    let metadataTable = test.querySelector('table.metadata tbody');
    let metadata = {};
    if (metadataTable) {
      let rows = metadataTable.querySelectorAll('tr');
      rows.forEach((row) => {
        let th = row.querySelector('th');
        let td = row.querySelector('td');
        if (th && td) {
          let key = th.innerText
            .trim()
            .replace(/[^a-zA-Z0-9]+/g, ' ')
            .replace(/ (.)/g, (match, group) => group.toUpperCase())
            .replace(/^./, (match) => match.toLowerCase());
          let value = td.innerText.trim();
          if (!th.innerText.includes('Expand All')) {
            metadata[key] = value;
          }
        }
      });
    }
    testCase['metadata'] = metadata;

    function extractTestSteps(stepElements) {
      let stepMap = {};
      let rootSteps = [];
      let allStepIds = [];
      let maxTestStepNumber = 0;

      stepElements.forEach((step) => {
        let stepId = step.id;
        allStepIds.push(stepId);
        let parts = stepId.split('-');
        let kPart = parts.find((p) => /^k\d+$/.test(p));
        if (kPart) {
          let num = parseInt(kPart.substring(1));
          if (num > maxTestStepNumber) maxTestStepNumber = num;
        }
      });

      function buildStepTree(parentId = '') {
        let children = stepElements.filter((step) => {
          let stepId = step.id;
          if (parentId === '') {
            return stepId.split('-k').length === 2;
          } else {
            return (
              stepId.startsWith(parentId + '-k') &&
              stepId.split('-k').length === parentId.split('-k').length + 1
            );
          }
        });

        let results = [];
        children.forEach((step) => {
          let stepId = step.id;
          let span = step.querySelector('.element-header span');
          let status = span ? span.className.trim().toUpperCase() : 'UNKNOWN';
          let stepNumbers = stepId
            .split('-')
            .filter((p) => /^k\d+$/.test(p))
            .map((p) => parseInt(p.substring(1)));
          let stepNumber = stepNumbers[stepNumbers.length - 1];

          let stepData = {
            testStepTitle:
              step.querySelector('.element-header')?.innerText.trim() || 'Unknown Test Step',
            status: status,
            TestStepNumber: stepNumber
          };

          let metaTable = step.querySelector('table.metadata tbody');
          if (metaTable) {
            let timeRow = metaTable.querySelector('tr');
            if (timeRow) {
              let timeTh = timeRow.querySelector('th');
              let timeTd = timeRow.querySelector('td');
              if (timeTh && timeTd && timeTh.innerText.includes('Start / End / Elapsed:')) {
                stepData['startEndElapsed'] = timeTd.innerText.trim();
              }
            }
          }

          let logTables = step.querySelectorAll(
            'table.messages.failed-message, table.messages.warning-message, table.messages.info-message'
          );
          let logs = [];
          logTables.forEach((table) => {
            let row = table.querySelector('tr.message-row');
            if (row) {
              let tds = row.querySelectorAll('td');
              let logEntry = {};
              tds.forEach((td) => {
                let className = td.className.trim();
                if (className === 'select-text') return;
                let value = td.innerText.trim();
                if (className === 'message' && value.includes('(Root cause')) {
                  value = value.split('(Root cause')[0].trim();
                }
                logEntry[className] = value;
              });
              logs.push(logEntry);
            }
          });
          if (logs.length > 0) stepData['testStepLogs'] = logs;

          let subSteps = buildStepTree(stepId);
          if (subSteps.length > 0) stepData['subSteps'] = subSteps;

          let totalSubStepCount = allStepIds.filter(
            (id) =>
              id.startsWith(stepId + '-k') && id.split('-k').length > stepId.split('-k').length
          ).length;
          stepData['numberOfSubSteps'] = totalSubStepCount;

          if (status === 'FAILED' || (stepData.subSteps && stepData.subSteps.length > 0)) {
            results.push(stepData);
          }
        });
        return results;
      }

      let steps = buildStepTree();
      return { rootSteps: steps, numberOfTestSteps: maxTestStepNumber };
    }

    let stepElements = Array.from(test.querySelectorAll('.keyword'));
    let { rootSteps, numberOfTestSteps } = extractTestSteps(stepElements);
    testCase['testSteps'] = rootSteps;
    testCase['numberOfTestSteps'] = numberOfTestSteps;
    testCases.push(testCase);
  });

  let result = {
    suite: {
      name: suiteName,
      metadata: suiteMetadata,
      test_cases: testCases
    }
  };

  console.log(JSON.stringify(result, null, 2));
  let blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
  let link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = suiteName + '.json';
  link.click();
  return result;
}

export default extractTableToJson;
