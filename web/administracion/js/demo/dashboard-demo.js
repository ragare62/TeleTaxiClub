$(function() {

    Morris.Area({
        element: 'morris-area-chart',
        data: [{
            periodo: '2010 Q1',
            servicios: 2666,
            clientes: null,
            club: 2647
        }, {
            periodo: '2010 Q2',
            servicios: 2778,
            clientes: 2294,
            club: 2441
        }, {
            periodo: '2010 Q3',
            servicios: 4912,
            clientes: 1969,
            club: 2501
        }, {
            periodo: '2010 Q4',
            servicios: 3767,
            clientes: 3597,
            club: 5689
        }, {
            periodo: '2011 Q1',
            servicios: 6810,
            clientes: 1914,
            club: 2293
        }, {
            periodo: '2011 Q2',
            servicios: 5670,
            clientes: 4293,
            club: 1881
        }, {
            periodo: '2011 Q3',
            servicios: 4820,
            clientes: 3795,
            club: 1588
        }, {
            periodo: '2011 Q4',
            servicios: 15073,
            clientes: 5967,
            club: 5175
        }, {
            periodo: '2012 Q1',
            servicios: 10687,
            clientes: 4460,
            club: 2028
        }, {
            periodo: '2012 Q2',
            servicios: 8432,
            clientes: 5713,
            club: 1791
        }],
        xkey: 'periodo',
        ykeys: ['servicios', 'clientes', 'club'],
        labels: ['Servicios', 'Clientes', 'Club'],
        pointSize: 2,
        hideHover: 'auto',
        resize: true
    });

    Morris.Donut({
        element: 'morris-donut-chart',
        data: [{
            label: "Clientes",
            value: 12
        }, {
            label: "Clientes + Club",
            value: 30
        }, {
            label: "Club",
            value: 20
        }],
        resize: true
    });

    Morris.Bar({
        element: 'morris-bar-chart',
        data: [{
            y: '2006',
            a: 100,
            b: 90
        }, {
            y: '2007',
            a: 75,
            b: 65
        }, {
            y: '2008',
            a: 50,
            b: 40
        }, {
            y: '2009',
            a: 75,
            b: 65
        }, {
            y: '2010',
            a: 50,
            b: 40
        }, {
            y: '2011',
            a: 75,
            b: 65
        }, {
            y: '2012',
            a: 100,
            b: 90
        }],
        xkey: 'y',
        ykeys: ['a', 'b'],
        labels: ['Series A', 'Series B'],
        hideHover: 'auto',
        resize: true
    });

});