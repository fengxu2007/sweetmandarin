let total_questions = 0;
let selected_section_index = 0;
let cross = '&#10060;'
let all_section_names = findSectionsInPool(question_bank.active);

function submitSectionRequest(){
    var section_id = 'div#one_section' + selected_section_index;
	var currentSectionQuestions = $(section_id + ' .singleChoice');
	var totalQuestion = currentSectionQuestions.length;
	var correct = 0;
	var error = 0;
	for (index = 0; index < currentSectionQuestions.length; index++) {
		var questionId = currentSectionQuestions[index].id;
		var optionSelected = $(section_id + ' [name=' + questionId + ']:checked').val();
		var answer = $(section_id + ' .answer[name=' + questionId + ']').val();
		if (optionSelected == answer) {
			correct++;
		}
		else{
//			$('#' + questionId + '_' + answer).addClass('correctOption');
			error ++;
		}
	}
	$('#result').show();
	$("#totalNumber").text(totalQuestion);
	$("#successNumber").text(correct);
	$("#failureNumber").text(error);
}

function resetOneSection() {
	$('#result').hide();
	showOrHideSection(selected_section_index, false);
	var oldSectionTable = $('div#one_section' + selected_section_index);
	oldSectionTable.remove();

    var newSectionTable = buildOneSection(question_bank.active, selected_section_index, all_section_names[selected_section_index]);
    $('#playArea').append(newSectionTable);
    showOrHideSection(selected_section_index, true);
}

function checkSectionAnswer(){
    var section_id = 'div#one_section' + selected_section_index;
	var currentSectionQuestions = $(section_id + ' .singleChoice');
	var totalQuestion = currentSectionQuestions.length;
	for (index = 0; index < currentSectionQuestions.length; index++) {
        var questionId = currentSectionQuestions[index].id;
        var optionSelected = $(section_id + ' [name=' + questionId + ']:checked').val();
        var answer = $(section_id + ' .answer[name=' + questionId + ']').val();
        var answerResultId = 'result' + index + '_' + answer;
        $(section_id + ' #' + answerResultId).html('&#9989;');
        if (optionSelected == answer) {
        }
        else{
            var wrongResultId = 'result' + index + '_' + optionSelected;
            $(section_id + ' #' + wrongResultId).html(cross);
        }
    }
	$('#result').hide();
}

function findSectionsInPool(activeQuestions) {
    var foundSectionNames = new Set();
    for (let index = 0; index < activeQuestions.length; index++) {
        foundSectionNames.add(activeQuestions[index]['tags']['section']);
    }
    var sections = Array.from(foundSectionNames);
    return sections.sort();
}

function findQuestionsByTag(activeQuestions, tag, tagName) {
    var questions = []
    for (let index = 0; index < activeQuestions.length; index++) {
        if (activeQuestions[index]['tags'][tag] == tagName) {
            questions.push(activeQuestions[index]);
        }
    }
    total_questions = questions.length;
    return questions;
}

function loadAllQuestions() {
    $('#playArea').empty();
    buildSections(question_bank.active, all_section_names);
    buildSectionControls();
}

function buildSections(activeQuestions, section_names) {
    for (let section_index = 0; section_index < section_names.length; section_index++) {
        var sectionTable = buildOneSection(activeQuestions, section_index, section_names[section_index]);
        $('#playArea').append(sectionTable);
        showOrHideSection(section_index, false);
    }
    //show first section by default.
    showOrHideSection(0, true);
}

function buildOneSection(activeQuestions, section_index, section_name) {
    var questions = findQuestionsByTag(activeQuestions, 'section', section_name);
    shuffle(questions);
    var sectionTable = buildQuestionList(questions, section_index);
    return sectionTable;
}

function showOrHideSection(section_index, show) {
    if (show) {
        $('div#one_section' + section_index).show();
    } else {
        $('div#one_section' + section_index).hide();
    }
}


function buildSectionControls() {
    for (let section_index = 0; section_index < all_section_names.length; section_index++) {
        $('#sectionsArea').append("<div class='sectionControl'><a class='sectionLink' id='" + section_index + "' href='#'>" + all_section_names[section_index] + "</a></div>");
    }

    $('#sectionsArea .sectionControl .sectionLink').click(function(e){
        e.preventDefault();
    	$('#result').hide();
        var newSelectionIndex = $(this).attr('id');
        if (newSelectionIndex != selected_section_index) {
            showOrHideSection(selected_section_index, false);
            selected_section_index = newSelectionIndex;
            showOrHideSection(selected_section_index, true);
        }
    });
}

function buildQuestionList(activeQuestions, selection_index) {
    var current_section_div = $('<div id="one_section' + selection_index + '"></div>');
    var table = $('<table id="examTable" class="examTable w3-centered"/>');
    table.append('<thead><tr><th></th></tr></thead>');
    var tbody = table.append('<tbody></tbody>');
    for (let index = 0; index < activeQuestions.length; index++) {
        var question = activeQuestions[index];
        var row = buildOneQuestion(index, question);
        tbody.append(row);
    }
    current_section_div.append(table);
    return current_section_div;
}

function buildOneQuestion(questionIndex, question) {
    var row ='<tr class="row">';
    row += '<td>';
    row += '<fieldset class="singleChoice" id="question' + questionIndex + '">';
    row += '<legend>Question ' + (questionIndex + 1) + ':</legend>';
    row += '<label>' + question.name + '</label><br/>';
    options = question.options;
    shuffle(options)
    for (let optionIndex = 0; optionIndex < options.length; optionIndex++) {
        var option = options[optionIndex];
        row += buildOneOption(questionIndex, optionIndex, option);
    }
    row += '</fieldset>';
    row += '</td>';
    row += '</tr>';
    return row;
}

function buildOneOption(questionIndex, optionIndex, option) {
    option_control = '<div id="question' + questionIndex + '_' + optionIndex + '" class="questionOption">';
    option_control += '<div class="result_mark" id="result' + questionIndex + '_' + optionIndex + '"></div>';
    option_control += '<input type="radio" name="question' + questionIndex + '" value="' + optionIndex + '"';
    if (option.answer) {
        option_control += ' class="answer"';
    }
    option_control += '/>' + option.desc;
    option_control += '</div>';
    return option_control;
}


function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}


$(document).ready(function() {
    loadAllQuestions();
});
