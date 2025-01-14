import * as contentModelToDom from 'roosterjs-content-model-dom/lib/modelToDom/contentModelToDom';
import * as contentModelToText from 'roosterjs-content-model-dom/lib/modelToText/contentModelToText';
import * as createModelToDomContext from 'roosterjs-content-model-dom/lib/modelToDom/context/createModelToDomContext';
import { exportContent } from '../../../lib/publicApi/model/exportContent';
import { IStandaloneEditor } from 'roosterjs-content-model-types';

describe('exportContent', () => {
    it('PlainTextFast', () => {
        const mockedTextContent = 'TEXT';
        const getTextContentSpy = jasmine
            .createSpy('getTextContent')
            .and.returnValue(mockedTextContent);
        const editor: IStandaloneEditor = {
            getDOMHelper: () => ({
                getTextContent: getTextContentSpy,
            }),
        } as any;

        const text = exportContent(editor, 'PlainTextFast');

        expect(text).toBe(mockedTextContent);
        expect(getTextContentSpy).toHaveBeenCalledTimes(1);
    });

    it('PlainText', () => {
        const mockedModel = 'MODEL' as any;
        const getContentModelCopySpy = jasmine
            .createSpy('getContentModelCopy')
            .and.returnValue(mockedModel);
        const editor: IStandaloneEditor = {
            getContentModelCopy: getContentModelCopySpy,
        } as any;
        const mockedText = 'TEXT';
        const contentModelToTextSpy = spyOn(
            contentModelToText,
            'contentModelToText'
        ).and.returnValue(mockedText);

        const text = exportContent(editor, 'PlainText');

        expect(text).toBe(mockedText);
        expect(getContentModelCopySpy).toHaveBeenCalledWith('disconnected');
        expect(contentModelToTextSpy).toHaveBeenCalledWith(mockedModel);
    });

    it('HTML', () => {
        const mockedModel = 'MODEL' as any;
        const getContentModelCopySpy = jasmine
            .createSpy('getContentModelCopy')
            .and.returnValue(mockedModel);
        const mockedHTML = 'HTML';
        const mockedDiv = {
            innerHTML: mockedHTML,
        } as any;
        const mockedDoc = {
            createElement: () => mockedDiv,
        } as any;
        const triggerEventSpy = jasmine.createSpy('triggerEvent');
        const editor: IStandaloneEditor = {
            getContentModelCopy: getContentModelCopySpy,
            getDocument: () => mockedDoc,
            triggerEvent: triggerEventSpy,
        } as any;
        const contentModelToDomSpy = spyOn(contentModelToDom, 'contentModelToDom');
        const mockedContext = 'CONTEXT' as any;
        const createModelToDomContextSpy = spyOn(
            createModelToDomContext,
            'createModelToDomContext'
        ).and.returnValue(mockedContext);

        const html = exportContent(editor, 'HTML');

        expect(html).toBe(mockedHTML);
        expect(getContentModelCopySpy).toHaveBeenCalledWith('disconnected');
        expect(createModelToDomContextSpy).toHaveBeenCalledWith();
        expect(contentModelToDomSpy).toHaveBeenCalledWith(
            mockedDoc,
            mockedDiv,
            mockedModel,
            mockedContext
        );
        expect(triggerEventSpy).toHaveBeenCalledWith(
            'extractContentWithDom',
            { clonedRoot: mockedDiv },
            true
        );
    });
});
