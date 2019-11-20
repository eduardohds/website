var firstColumn = 0;
        var lastColumn = 0;
        main();

        function main() {

            var curUrl = document.URL;

            if ((curUrl.indexOf('salesforce.com') != -1) || (curUrl.indexOf('localhost:') != -1)) {
                setColumnNumbers();
                var columnsName = getColumnNames();
                var FieldsWithDependencies = getFieldsWithDependencies(columnsName);
                var csvData = getCsv(FieldsWithDependencies);
                openPopup(csvData);
            }
            else {
                alert("Sorry, I don't recognize this page or its format :(");
                return;
            }
        }

        function setColumnNumbers() {
            var navElements = document.getElementsByClassName('navigationHeaderNormal');
            if (navElements[0] === undefined) {
                navElements = document.getElementsByClassName('navigationHeaderAll');
            }
            var navText = navElements[0].innerHTML;
            var startIndex = navText.indexOf('Showing Columns:') + 'Showing Columns:'.length;
            var endIndex = navText.indexOf('-', startIndex);
            var firstColumnStr = navText.substring(startIndex, endIndex);
            startIndex = endIndex + 1;
            endIndex = navText.indexOf('(of');
            var lastColumnStr = navText.substring(startIndex, endIndex);
            firstColumn = parseInt(firstColumnStr.trim()); // 11;
            lastColumn = parseInt(lastColumnStr.trim());;
            firstColumn = firstColumn - 1;
            lastColumn = lastColumn - 1;
        }

        function getCsv(fieldsWithDependencies) {
            var rtnCsv = '';
            var sepChar = ',';
            var crChar = '\r\n';
            for (i = 0; i < fieldsWithDependencies.length; i++) {
                var fieldName = fieldsWithDependencies[i][0];
                var dependencies = fieldsWithDependencies[i][1];
                for (j = 0; j < dependencies.length; j++) {
                    rtnCsv += '"' + fieldName + '"' + sepChar + '"' + dependencies[j] + '"' + crChar;
                }
            }
            return rtnCsv;
        }

        function getFieldsWithDependencies(columnsName) {
            var FieldsWithDependencies = [];
            for (i = 0; i < columnsName.length; i++) {
                var fieldValues = getEnabledRowsForColumn(i + firstColumn);
                var row = [columnsName[i], fieldValues];
                FieldsWithDependencies.push(row);
            }
            return FieldsWithDependencies;
        }

        function getColumnNames() {
            var colCount = firstColumn; // 0;
            var columnNameBase = 'th_r0c';
            var columnNames = [];
            while (colCount <= lastColumn) {
                var cellElement = document.getElementById(columnNameBase + colCount.toString());
                if (cellElement != null) {
                    var cellElementStrippedString = cellElement.innerHTML.replace('&nbsp;', '').replace('&nbsp;', '');
                    if (cellElementStrippedString.length > 0) {
                        columnNames.push(cellElementStrippedString);
                        colCount++;
                    }
                } 
            }
            return columnNames;
        }

        function getEnabledRowsForColumn(colNum) {
            var rowCount = 0;
            var fieldValues = [];
            var cellNameBase = 'te_r{0}c' + colNum;

            while (rowCount < 1000) {
                var cellId = cellNameBase.replace('{0}', rowCount.toString());
                var cellElement = document.getElementById(cellId);
                if (cellElement != null) {
                    if (cellElement.className == 'shownPickValue') {
                        var cellElementStrippedString = cellElement.innerHTML.replace('&nbsp;', '').replace('&nbsp;', '');
                        if (cellElementStrippedString.length > 0) {
                            fieldValues.push(cellElementStrippedString);
                        }
                    }
                    rowCount++;
                } else {
                    rowCount = 1001;
                }
            }
            return fieldValues;
        }

        function openPopup(csvData) {
            var popBox = document.createElement("div");
            popBox.style.backgroundColor = "#81da7a";
            popBox.style.position = "absolute";
            popBox.style.width = "700px";
            popBox.style.top = "50px";
            popBox.style.left = "200px";
            popBox.style.border = "solid 3px white";
            popBox.style.padding = "20px";
            popBox.id = "TTPopupBox";

            var closebutton = document.createElement("div");
            closebutton.id = "ttCloseButton";
            closebutton.style.backgroundColor = "white";
            closebutton.style.width = "70px";
            closebutton.onclick = removePopupBox;
            closebutton.appendChild(document.createTextNode("CLOSE"));
            popBox.appendChild(closebutton);

            var csvTextArea = document.createElement("textarea");
            csvTextArea.style.width = "500px";
            csvTextArea.style.height = "500px";
            csvTextArea.appendChild(document.createTextNode(csvData));
            popBox.appendChild(csvTextArea);

            document.body.appendChild(popBox);
        }

        function removePopupBox() {
            var popBox = document.getElementById("TTPopupBox");
            popBox.parentNode.removeChild(popBox);
        }
