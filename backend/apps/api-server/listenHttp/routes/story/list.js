const dbMongo = require('@ss/dbMongo');
const StoryDao = require('@ss/daoMongo/StoryDao');
const ResourceDao = require('@ss/daoMongo/ResourceDao');

const mongo = require('@ss/dbMongo');
const _ = require('lodash');


module.exports = async (ctx, next) => {
    try {
        const storyDao = new StoryDao(dbMongo.storyConnect);
        const resourceDao = new ResourceDao(dbMongo.storyConnect);

        const storyList = await storyDao.findAll();

        if (storyList === null ) {
            ctx.status = 200;
            ctx.body = {};
            await next();
            return;
        }

        storyList.map((item) => {
            item.id = item.storyId;
            delete item.storyId;
            delete item.code;
            delete item.summary;
            delete item._id;
        });

        const resourceList = await resourceDao.findAll();


        let resourceMap = {};
        resourceList.map((item) => {
            (resourceMap[item.storyId] ||
                (resourceMap[item.storyId] = []))
                .push(item);

            item.id = item.resourceId;

            delete item.resourceId;
            delete item._id;
            delete item.storyId;
        })

        storyList.map((item) => {
            if (resourceMap[item.id]) {
                item.resourceList = resourceMap[item.id];
            }
        })

        ctx.status = 200;
        ctx.body = { storyList };
        await next();
    }
    catch (err) {
        console.error(err);
        await next();
    }

    
}


/**
 * @swagger
 * resourcePath: /api
 * description: All about API
 */

/**
 * @swagger
 * path: /story/list
 * operations:
 *   -  httpMethod: GET
 *      summary: 로비 구성되는 스토리 정보
 *      notes: |
 *        <br> api /config에서 받은 cdnUrl과
 *        <br> api /story/list에서 받은 resourceList의 story.id, version, resource.id를 조립해 url을 생성합니다.
 *        <br> 생성된 url로 파일 다운로드를 하시면 됩니다.
 *        <br>${cdnUrl}/${story.id}/{aos|ios}/${version}/${resource.id}
 *        <br>http://story.storyself.com/GoldilocksAndTheThreeBears/aos/1/scene
 *
 *        <br> crc32코드를 스토리 진입전에 확인하시고 맞지 않다면 다시 다운 받아 진행하시면 됩니다.
 *      responseClass: Response
 *      nickname: config
 *      consumes:
 *        - text/html
 */

/**
 * @swagger
 * models:
 *   Response:
 *     properties:
 *       StoryData:
 *         type: array
 *         required: true
 *         items:
 *           $ref: 'StoryData'
 *   StoryData:
 *     id: StoryData
 *     properties:
 *       status:
 *         type: int
 *         required: true
 *         description: '0: 비활성화, 1: 활성화'
 *       id:
 *         type: String
 *         required: true
 *       resourceList:
 *         type: array
 *         items:
 *           $ref: 'ResourceData'
 *   ResourceData:
 *     id: ResourceData
 *     properties:
 *       id:
 *         type: String
 *         required: true
 *       crc32:
 *         type: String
 *         required: true
 *       size:
 *         type: int
 *         required: true
 *       version:
 *         type: int
 *         required: true
 */