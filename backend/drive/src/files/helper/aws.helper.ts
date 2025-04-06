import { UploadPartCommandInput } from '@aws-sdk/client-s3';
import * as AWS from 'aws-sdk';


export class AwsHelper {
    providers
    awsS3Bucket
    ttl
    s3Client

    setConfig(config: any) {
        this.awsS3Bucket = config.bucketName;
        this.ttl = config.ttl;
        this.s3Client = new AWS.S3({
            accessKeyId: config.accessKeyId,
            secretAccessKey: config.secretAccessKey,
            region: config.region,
        });
    }

    download(config: any, key: string) {
        this.setConfig(config)
        const params = {
            Bucket: this.awsS3Bucket,
            Key: key,
            Expires: this.ttl,
        };
        const url = this.s3Client.getSignedUrl('getObject', params);
        return {
            url: String(url),
            expiry: new Date(new Date().getTime() + this.ttl * 1000),
        };
    }

    async upload(
        config: any,
        file: any,
        name: string,
    ) {
        this.setConfig(config);
        const fileBuffer: Uint8Array = new Uint8Array(file.buffer);
        const fileType = file.mimetype;
        let createUploadData;
        createUploadData = await this.createMultipartUpload({
            Bucket: this.awsS3Bucket,
            Key: name,
            ContentType: fileType,
        });

        let partParams: UploadPartCommandInput[] = [];
        let initialPartNumber = 0;
        const minPartSize = 1024 * 1024 * 5;

        for (
            let rangeStart = 0;
            rangeStart < fileBuffer.length;
            rangeStart += minPartSize
        ) {
            initialPartNumber++;
            const end = Math.min(rangeStart + minPartSize, fileBuffer.length);
            try {
                const part = {
                    Body: fileBuffer.slice(rangeStart, end),
                    Bucket: this.awsS3Bucket,
                    Key: name,
                    PartNumber: Number(initialPartNumber),
                    UploadId: createUploadData.UploadId,
                }
                partParams.push(part);
            }
            catch (err) {
                console.error(err)
            }

        }

        console.info(`part_params ${partParams}`);
        const multipartUpload = await this.uploadPart(partParams);

        const doneParams = {
            Bucket: this.awsS3Bucket,
            Key: name,
            MultipartUpload: multipartUpload,
            UploadId: createUploadData.UploadId,
        };

        let completeUploadData;
        completeUploadData = await this.completeMultipartUpload(doneParams);

        return {
            provider: 'awsS3',
            expiry: null,
            url: null,
            ...completeUploadData,
        };
    }

    async uploadPart(partParams: any) {
        let partNo = 1;
        let uploaded = {}
        let parts: CompletedPart[] = [];


        for (let index = 0; index < partParams.length; index++) {
            const part = partParams[index];

            let data
            data = await new Promise((resolve, reject) => {
                this.s3Client.uploadPart(part, function (err, data) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                });
            });

            const val = {
                ETag: data['ETag'],
                PartNumber: partNo,
            }
            parts.push(val);
            partNo++;
        }
        uploaded['Parts'] = parts;

        return uploaded;
    }

    createMultipartUpload(param: any) {
        return new Promise((resolve, reject) => {
            this.s3Client.createMultipartUpload(param, function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    completeMultipartUpload(doneParams: any) {
        return new Promise((resolve, reject) => {
            this.s3Client.completeMultipartUpload(doneParams, function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }
}

interface CompletedPart {
    ETag: string;
    PartNumber: number;
}