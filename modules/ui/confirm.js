import { t } from '../core/localizer';
import { uiModal } from './modal';


export function uiConfirm(selection) {
    var modalSelection = uiModal(selection);

    modalSelection.select('.modal')
        .classed('modal-alert', true);

    var section = modalSelection.select('.content');

    section.append('div')
        .attr('class', 'modal-section header');

    section.append('div')
        .attr('class', 'modal-section message-text');

    var buttons = section.append('div')
        .attr('class', 'modal-section buttons cf');


    modalSelection.okButton = function() {
        buttons
            .append('button')
            .attr('class', 'button ok-button action')
            .on('click.confirm', function() {
                modalSelection.remove();
            })
            .html(t.html('confirm.okay'))
            .node()
            .focus();

        return modalSelection;
    };

    modalSelection.saveButton = function(callback, selection) {
        buttons
            .append('button')
            .attr('class', 'button ok-button action')
            .on('click.confirm', function() {
                callback(selection);
            })
            .html('Сохранить')
            .node()
            .focus();

        return modalSelection;
    };


    return modalSelection;
}
