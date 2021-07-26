import { actionAddEntity } from '../actions/add_entity';
import { actionAddMidpoint } from '../actions/add_midpoint';
import { actionAddVertex } from '../actions/add_vertex';

import { behaviorAddWay } from '../behavior/add_way';
import { modeDrawLine } from './draw_line';
import { osmNode, osmWay } from '../osm';
import { uiCoordinatesInputs } from '../ui/coordinates_inputs';

export function modeAddLine(context, mode) {
    mode.id = 'add-line';

    var behavior = behaviorAddWay(context)
        .on('start', start)
        .on('startFromWay', startFromWay)
        .on('startFromNode', startFromNode);

    var defaultTags = {};
    if (mode.preset) defaultTags = mode.preset.setTags(defaultTags, 'line');
    var coordinatesInputs = uiCoordinatesInputs();


    function start(loc) {
        var startGraph = context.graph();
        var node = osmNode({ loc: loc });
        var way = osmWay({ tags: defaultTags });

        context.perform(
            actionAddEntity(node),
            actionAddEntity(way),
            actionAddVertex(way.id, node.id)
        );

        context.enter(modeDrawLine(context, way.id, startGraph, mode.button));
    }


    function startFromWay(loc, edge) {
        var startGraph = context.graph();
        var node = osmNode({ loc: loc });
        var way = osmWay({ tags: defaultTags });

        context.perform(
            actionAddEntity(node),
            actionAddEntity(way),
            actionAddVertex(way.id, node.id),
            actionAddMidpoint({ loc: loc, edge: edge }, node)
        );

        context.enter(modeDrawLine(context, way.id, startGraph, mode.button));
    }


    function startFromNode(node) {
        var startGraph = context.graph();
        var way = osmWay({ tags: defaultTags });

        context.perform(
            actionAddEntity(way),
            actionAddVertex(way.id, node.id)
        );

        context.enter(modeDrawLine(context, way.id, startGraph, mode.button));
    }


    mode.renderContentModal = function(selection, hideError) {
        var firstCoordsDiv = selection
            .append('div')
            .attr('class', 'coords-wrapper coords-wrapper_first-coords');

        firstCoordsDiv
            .append('h5')
            .text('Первая точка');

        coordinatesInputs(firstCoordsDiv, hideError);


        var secondCoordsDiv = selection
            .append('div')
            .attr('class', 'coords-wrapper coords-wrapper_second-coords');

        secondCoordsDiv
            .append('h5')
            .text('Вторая точка');

        coordinatesInputs(secondCoordsDiv, hideError);
    };

    mode.addByCoords = function(selection) {
        // [30.365, 59.94387]
        // [30.366, 59.94384]

        var firstCoordinates = coordinatesInputs.getValues(selection, '.modal-section.message-text .coords-wrapper_first-coords');
        var secondCoordinates = coordinatesInputs.getValues(selection, '.modal-section.message-text .coords-wrapper_second-coords');

        if (coordinatesInputs.validate(firstCoordinates) && coordinatesInputs.validate(secondCoordinates)) {
            context.map().centerZoom([secondCoordinates.longitude, secondCoordinates.latitude], 21);

            start([firstCoordinates.longitude, firstCoordinates.latitude]);
            context.mode().finish([secondCoordinates.longitude, secondCoordinates.latitude]);

            selection.remove();

            return;
        }

        selection
            .select('.modal-section.message-text .error-message')
            .attr('class', 'error-message');
    };

    mode.enter = function() {
        context.install(behavior);
    };


    mode.exit = function() {
        context.uninstall(behavior);
    };

    return mode;
}
