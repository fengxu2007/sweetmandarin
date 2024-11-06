let current_page = 0;
let total_questions = 0;
let default_page_length = 2;
let selected_section = "Review";
let cross = '&#10060;'

function submitRequest(){
//	$(".correctOption").removeClass('correctOption');
	var questions = $('.singleChoice');
	var totalQuestion = questions.length;
	var correct = 0;
	var error = 0;
	for (index = 0; index < questions.length; index++) {
		var questionId = questions[index].id;
		var optionSelected = $('[name=' + questionId + ']:checked').val();
		var answer = $('.answer[name=' + questionId + ']').val();
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

function reset() {
	loadQuestions();
	$('#result').hide();
	current_page = 0;
	updatePage(current_page, true);
}

function checkAnswer(){
	var questions = $('.singleChoice');
	var totalQuestion = questions.length;
	for (index = 0; index < questions.length; index++) {
        var questionId = questions[index].id;
        var optionSelected = $('[name=' + questionId + ']:checked').val();
        var answer = $('.answer[name=' + questionId + ']').val();
        var answerResultId = 'result' + index + '_' + answer;
        $('#' + answerResultId).html('&#9989;');
        if (optionSelected == answer) {
        }
        else{
            var wrongResultId = 'result' + index + '_' + optionSelected;
            $('#' + wrongResultId).html(cross);
        }
    }
	showResults();
	$('#result').hide();
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

function loadQuestions() {
    $('#playArea').empty();
    var questions = findQuestionsByTag(question_bank.active, 'section', selected_section);
    shuffle(questions);
    var table = buildQuestionList(questions);
    $('#playArea').append(table);
    pagination();
}

//function paginationWithDataTable() {
//    new DataTable('#examTable', {
//        info: false,
//        ordering: false,
//        searching: false,
//        lengthChange: false,
//        pageLength: 1,
//        pagingType: "full",
//        language: {
//            paginate: {
//                next: 'Next Question',
//                previous: 'Previous Question',
//                first: 'First Question',
//                last: 'Last Question'
//            }
//        }
//    });
//
//}

function showResults() {
    $('#paginationControl').remove();
    var rows = $('#examTable tbody tr');
    for (let index = 0; index < rows.length; index++) {
        $(rows[index]).show();
    }
}

function getPageCounts() {
    if (total_questions % default_page_length == 0) {
        return total_questions / default_page_length;
    } else {
        return Math.floor(total_questions / default_page_length) + 1;
    }
}

function getFirstQuestionIndexByPageNumber(pageNumber) {
    return pageNumber * default_page_length;
}

function getLastQuestionIndexByPageNumber(pageNumber) {
    var firstQuestionIndex = getFirstQuestionIndexByPageNumber(pageNumber);
    if (firstQuestionIndex + default_page_length >= total_questions) {
        return total_questions - 1;
    } else {
        return firstQuestionIndex + default_page_length - 1;
    }
}

function updatePage(pageNumber, show) {
    var rows = $('#examTable tbody tr');
    for (let questionIndex = getFirstQuestionIndexByPageNumber(pageNumber);
        questionIndex <= getLastQuestionIndexByPageNumber(pageNumber); questionIndex++) {
        if (show) {
            $(rows[questionIndex]).show();
        } else {
            $(rows[questionIndex]).hide();
        }
    }

}

function pagination() {
    $('#playArea').append("<div id='paginationControl'></div>");
    $('#paginationControl').append("<div class='paginationLink'><a id='previousQuestion' href='#'>Previous</a></div>");
    $('#paginationControl').append("<div class='paginationLink'><a id='nextQuestion' href='#'>Next</a></div>");
    var rows = $('#examTable tbody tr');
    updatePage(0, true);
    for (let index = default_page_length; index < rows.length; index++) {
        $(rows[index]).hide();
    }

    $('#paginationControl #previousQuestion').click(function(e){
        e.preventDefault();
        var rows = $('#examTable tbody tr');
        if (current_page > 0) {
            updatePage(current_page, false);
            current_page -= 1;
            updatePage(current_page, true);
        }
    });

    $('#paginationControl #nextQuestion').click(function(e){
        e.preventDefault();
        var rows = $('#examTable tbody tr');
        if (current_page < getPageCounts() - 1) {
            updatePage(current_page, false);
            current_page += 1;
            updatePage(current_page, true);
        }
    });
}

function buildQuestionList(activeQuestions) {
    var table = $('<table id="examTable" class="examTable w3-centered"/>');
    table.append('<thead><tr><th></th></tr></thead>');
    var tbody = table.append('<tbody></tbody>');
    for (let index = 0; index < activeQuestions.length; index++) {
        var question = activeQuestions[index];
        var row = buildOneQuestion(index, question);
        tbody.append(row);
    }
    return table;
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
    loadQuestions();
});
