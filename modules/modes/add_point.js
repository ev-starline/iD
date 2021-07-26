import { t } from '../core/localizer';
import { behaviorDraw } from '../behavior/draw';
import { modeBrowse } from './browse';
import { modeSelect } from './select';
import { osmNode } from '../osm/node';
import { actionAddEntity } from '../actions/add_entity';
import { actionChangeTags } from '../actions/change_tags';
import { actionAddMidpoint } from '../actions/add_midpoint';
import { uiCoordinatesInputs } from '../ui/coordinates_inputs';


export function modeAddPoint(context, mode) {

    mode.id = 'add-point';

    var behavior = behaviorDraw(context)
        .on('click', add)
        .on('clickWay', addWay)
        .on('clickNode', addNode)
        .on('cancel', cancel)
        .on('finish', cancel);

    var defaultTags = {};
    if (mode.preset) defaultTags = mode.preset.setTags(defaultTags, 'point');
    var coordinatesInputs = uiCoordinatesInputs();

    function add(loc) {
        var node = osmNode({ loc: loc, tags: defaultTags });

        context.perform(
            actionAddEntity(node),
            t('operations.add.annotation.point')
        );

        enterSelectMode(node);
    }


    function addWay(loc, edge) {
        var node = osmNode({ tags: defaultTags });

        context.perform(
            actionAddMidpoint({loc: loc, edge: edge}, node),
            t('operations.add.annotation.vertex')
        );

        enterSelectMode(node);
    }

    function enterSelectMode(node) {
        context.enter(
            modeSelect(context, [node.id]).newFeature(true)
        );
    }


    function addNode(node) {
        if (Object.keys(defaultTags).length === 0) {
            enterSelectMode(node);
            return;
        }

        var tags = Object.assign({}, node.tags);  // shallow copy
        for (var key in defaultTags) {
            tags[key] = defaultTags[key];
        }

        context.perform(
            actionChangeTags(node.id, tags),
            t('operations.add.annotation.point')
        );

        enterSelectMode(node);
    }


    function cancel() {
        context.enter(modeBrowse(context));
    }


    mode.renderContentModal = function(section, hideError) {
        coordinatesInputs(section, hideError);
    };

    mode.addByCoords = function(selection) {
        var coordinates = coordinatesInputs.getValues(selection, '.modal-section.message-text');

        if (coordinatesInputs.validate(coordinates)) {
            context.map().centerZoom([coordinates.longitude, coordinates.latitude], 21);
            add([coordinates.longitude, coordinates.latitude]);

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
