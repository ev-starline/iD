import { utilGetSetValue } from '../util';

export function uiCoordinatesInputs() {

    function coordinatesInputs(selection, hideError) {
        var wrapperLat = selection
            .append('div')
            .attr('class', 'input-wrapper');

        wrapperLat
            .append('label')
            .text('Широта');

        wrapperLat
            .append('input')
            .attr('type', 'text')
            .attr('class', 'coords coords__lat')
            .on('click', hideError);

        var wrapperLon = selection
            .append('div')
            .attr('class', 'input-wrapper');

        wrapperLon
            .append('label')
            .text('Долгота');

        wrapperLon
            .append('input')
            .attr('type', 'text')
            .attr('class', 'coords coords__lon')
            .on('click', hideError);
    }

    coordinatesInputs.getValues = function(selection, className) {
        var inputLat = selection
            .select(className + ' .coords__lat');
        var inputLon = selection
            .select(className + ' .coords__lon');

        return {
            latitude: parseFloat(utilGetSetValue(inputLat).trim()),
            longitude: parseFloat(utilGetSetValue(inputLon).trim()),
        };
    };

    coordinatesInputs.validate = function(coordinates) {
        if (isFinite(coordinates.latitude) && isFinite(coordinates.longitude)) {
            var MAX_DEGREE_LATITUDE = 90;
            var MIN_DEGREE_LATITUDE = -90;

            var MAX_DEGREE_LONGITUDE = 180;
            var MIN_DEGREE_LONGITUDE = -180;

            return coordinates.latitude >= MIN_DEGREE_LATITUDE && coordinates.latitude <= MAX_DEGREE_LATITUDE
                && coordinates.longitude >= MIN_DEGREE_LONGITUDE && coordinates.longitude <= MAX_DEGREE_LONGITUDE;
        }

        return false;
    };

    return coordinatesInputs;
}
