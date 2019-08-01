/*
 * Author: Abdullah A Almsaeed
 * Date: 4 Jan 2014
 * Description:
 *      This is a demo file used only for the main dashboard (index.html)
 **/

$(function() {
    "use strict";

    //Make the dashboard widgets sortable Using jquery UI
    $(".connectedSortable").sortable({
        placeholder: "sort-highlight",
        connectWith: ".connectedSortable",
        handle: ".box-header, .nav-tabs",
        forcePlaceholderSize: true,
        zIndex: 999999
    }).disableSelection();
    $(".box-header, .nav-tabs").css("cursor","move");
    //jQuery UI sortable for the todo list
    $(".todo-list").sortable({
        placeholder: "sort-highlight",
        handle: ".handle",
        forcePlaceholderSize: true,
        zIndex: 999999
    }).disableSelection();;

    //bootstrap WYSIHTML5 - text editor
    $(".textarea").wysihtml5();

    $('.daterange').daterangepicker(
            {
                ranges: {
                    'Today': [moment(), moment()],
                    'Yesterday': [moment().subtract('days', 1), moment().subtract('days', 1)],
                    'Last 7 Days': [moment().subtract('days', 6), moment()],
                    'Last 30 Days': [moment().subtract('days', 29), moment()],
                    'This Month': [moment().startOf('month'), moment().endOf('month')],
                    'Last Month': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
                },
                startDate: moment().subtract('days', 29),
                endDate: moment()
            },
    function(start, end) {
        alert("You chose: " + start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
    });

    /* jQueryKnob */
    $(".knob").knob();

    //jvectormap data
    var visitorsData = {
        "US": 398, //USA
        "SA": 400, //Saudi Arabia
        "CA": 1000, //Canada
        "DE": 500, //Germany
        "FR": 760, //France
        "CN": 300, //China
        "AU": 700, //Australia
        "BR": 600, //Brazil
        "IN": 800, //India
        "GB": 320, //Great Britain
        "RU": 3000 //Russia
    };
    //World map by jvectormap
    $('#world-map').vectorMap({
        map: 'world_mill_en',
        backgroundColor: "#fff",
        regionStyle: {
            initial: {
                fill: '#e4e4e4',
                "fill-opacity": 1,
                stroke: 'none',
                "stroke-width": 0,
                "stroke-opacity": 1
            }
        },
        series: {
            regions: [{
                    values: visitorsData,
                    scale: ["#3c8dbc", "#2D79A6"], //['#3E5E6B', '#A6BAC2'],
                    normalizeFunction: 'polynomial'
                }]
        },
        onRegionLabelShow: function(e, el, code) {
            if (typeof visitorsData[code] != "undefined")
                el.html(el.html() + ': ' + visitorsData[code] + ' new visitors');
        }
    });

    //Sparkline charts
    var myvalues = [15, 19, 20, -22, -33, 27, 31, 27, 19, 30, 21];
    $('#sparkline-1').sparkline(myvalues, {
        type: 'bar',
        barColor: '#00a65a',
        negBarColor: "#f56954",
        height: '20px'
    });
    myvalues = [15, 19, 20, 22, -2, -10, -7, 27, 19, 30, 21];
    $('#sparkline-2').sparkline(myvalues, {
        type: 'bar',
        barColor: '#00a65a',
        negBarColor: "#f56954",
        height: '20px'
    });
    myvalues = [15, -19, -20, 22, 33, 27, 31, 27, 19, 30, 21];
    $('#sparkline-3').sparkline(myvalues, {
        type: 'bar',
        barColor: '#00a65a',
        negBarColor: "#f56954",
        height: '20px'
    });
    myvalues = [15, 19, 20, 22, 33, -27, -31, 27, 19, 30, 21];
    $('#sparkline-4').sparkline(myvalues, {
        type: 'bar',
        barColor: '#00a65a',
        negBarColor: "#f56954",
        height: '20px'
    });
    myvalues = [15, 19, 20, 22, 33, 27, 31, -27, -19, 30, 21];
    $('#sparkline-5').sparkline(myvalues, {
        type: 'bar',
        barColor: '#00a65a',
        negBarColor: "#f56954",
        height: '20px'
    });
    myvalues = [15, 19, -20, 22, -13, 27, 31, 27, 19, 30, 21];
    $('#sparkline-6').sparkline(myvalues, {
        type: 'bar',
        barColor: '#00a65a',
        negBarColor: "#f56954",
        height: '20px'
    });

    //Date for the calendar events (dummy data)
    var date = new Date();
    var d = date.getDate(),
            m = date.getMonth(),
            y = date.getFullYear();

    //Calendar
    $('#calendar').fullCalendar({
        editable: true, //Enable drag and drop
        events: [
            {
                title: 'Aluguel',
                start: new Date(y, m, 1),
                backgroundColor: "#ff9900",  
                borderColor: "#dd8800"  
            },
            {
                title: 'água',
                start: new Date(y, m, 4),
                backgroundColor: "#ff9900",  
                borderColor: "#dd8800"  
            },
            {
                title: 'Telefone',
                start: new Date(y, m, 10),
                backgroundColor: "#ff9900",  
                borderColor: "#dd8800"  
            },
            {
                title: 'Parcela - Carro',
                start: new Date(y, m, 27),
                backgroundColor: "#ffcc00",  
                borderColor: "#cc9900"  
            }, 
            {
                title: 'Pensão',
                start: new Date(y, m, 5), 
                backgroundColor: "#ff9900",  
                borderColor: "#dd8800"  
            }
        ],
        buttonText: {//This is to add icons to the visible buttons
            prev: "<span class='fa fa-caret-left'></span>",
            next: "<span class='fa fa-caret-right'></span>",
            today: 'today',
            month: 'month',
            week: 'week',
            day: 'day'
        },
        header: {
            left: 'title',
            center: '',
            right: 'prev,next'
        } ,
        monthNames : ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho',
                      'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
    });

    //SLIMSCROLL FOR CHAT WIDGET
    $('#chat-box').slimScroll({
        height: '250px'
    });
     
    
    /* Morris.js Charts */
    // Sales chart
    var area = new Morris.Area({
        element: 'revenue-chart',
        resize: true,
        data: [ 
               {y: '2013-05', item1: 3212, item2: 1333},
               {y: '2013-06', item1: 3242, item2: 1742},
               {y: '2013-07', item1: 2666, item2: 2666},
               {y: '2013-08', item1: 2778, item2: 2294},
               {y: '2013-09', item1: 4912, item2: 1969},
               {y: '2013-10', item1: 3767, item2: 3597},
               {y: '2013-11', item1: 6810, item2: 1914},
               {y: '2013-12', item1: 5670, item2: 4293},
               {y: '2014-01', item1: 4820, item2: 3795},
               {y: '2014-02', item1: 15073,item2: 5967},
               {y: '2014-03', item1: 10687,item2: 4460},
               {y: '2014-04', item1: 8432, item2: 5713}
        ],
        xkey: 'y',
        ykeys: ['item1', 'item2'], 
        labels: ['Despesas', 'Receitas'],
        lineColors: ['#f56954', '#00a65a'],
        hideHover: 'auto'
    });
    
    //Donut Chart
    var donut2 = new Morris.Donut({
        element: 'sales-chart2',
        resize: true,
        colors: ["#ff9900", '#ffcc00', '#f56954', '#00a65a'],
        data: [
               {label: "Agendamentos", value: 1350},
               {label: "Parcelas", value: 1336},
               {label: "Despesas Gerais", value: 1500},
               {label: "Receitas", value: 4890} 
        ],
        hideHover: 'auto'
    });

    var donut = new Morris.Donut({
        element: 'sales-chart',
        resize: true,
        colors: ["#3c8dbc", "#f56954", "#00a65a"],
        data: [
            {label: "Download Sales", value: 12},
            {label: "In-Store Sales", value: 30},
            {label: "Mail-Order Sales", value: 20}
        ],
        hideHover: 'auto'
    });
    
    //Bar chart
    var bar = new Morris.Bar({
        element: 'bar-chart',
        resize: true,
        data: [ 
            {y: 'abril/2014', a: 56, b: 13, c: 87, d: 66}
        ],
        barColors: ['#ff9900', '#ffcc00', '#f56954', '#00a65a'],
        xkey: 'y',
        ykeys: ['a', 'b', 'c', 'd' ],
        labels: ['Agendamentos', 'Parcelas', 'Despesas Gerais', 'Receitas'],
        hideHover: 'auto'
    });
    
    //Bar chart
    var bar2 = new Morris.Bar({
        element: 'bar-chart2',
        resize: true,
        data: [ 
            {y: 'fevereiro/2014', a: 45, b: 34, c: 77, d: 90}, 
            {y: 'marco/2014', a: 44, b: 12, c: 65, d: 88}, 
            {y: 'abril/2014', a: 56, b: 13, c: 87, d: 66}
        ],
        barColors: ['#ff9900', '#ffcc00', '#f56954', '#00a65a'],
        xkey: 'y',
        ykeys: ['a', 'b', 'c', 'd' ],
        labels: ['Agendamentos', 'Parcelas', 'Despesas Gerais', 'Receitas'],
        hideHover: 'auto'
    });
    
    //Fix for charts under tabs
    $('.box ul.nav a').on('shown.bs.tab', function(e) {
        area.redraw();
        donut.redraw();
    });


    /* BOX REFRESH PLUGIN EXAMPLE (usage with morris charts) */
    $("#loading-example").boxRefresh({
        source: "ajax/dashboard-boxrefresh-demo.php",
        onLoadDone: function(box) {
           var bar = new Morris.Bar({
                element: 'bar-chart',
                resize: true,
                data: [ 
                       {y: 'janeiro/2014', a: 56, b: 13, c: 87, d: 66},
                       {y: 'fevereiro/2014', a: 44, b: 12, c: 65, d: 88}, 
                       {y: 'mar�o/2014', a: 45, b: 34, c: 77, d: 90}, 
                       {y: 'abril/2014', a: 35, b: 45, c: 66, d: 80}
                   ],
                   barColors: ['#ff9900', '#ffcc00', '#f56954', '#00a65a'],
                   xkey: 'y',
                   ykeys: ['a', 'b', 'c', 'd' ],
                   labels: ['Agendamentos', 'Parcelas', 'Despesas Gerais', 'Receitas'],
                   hideHover: 'auto'
            });
        }
    });

    /* The todo list plugin */
    $(".todo-list").todolist({
        onCheck: function(ele) {
            //console.log("The element has been checked")
        },
        onUncheck: function(ele) {
            //console.log("The element has been unchecked")
        }
    });

});