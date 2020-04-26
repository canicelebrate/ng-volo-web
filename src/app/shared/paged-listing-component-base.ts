import { ABP } from '@abp/ng.core';
import { Injector, OnInit } from '@angular/core';
import { AppComponentBase } from './app-component-base';

export abstract class PagedListingComponentBase<EntityDto extends ABP.BasicItem> extends AppComponentBase implements OnInit {
  public pageSize = 10;
  public pageNumber = 1;
  public totalPages = 1;
  public totalItems: number;
  public isTableLoading = false;

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.getDataPage(this.pageNumber);
  }

  public showPaging(result: ABP.BasicItem[], totalCount: number, pageNumber: number): void {
    if (this.pageSize !== 1) {
      this.totalPages = (totalCount - (totalCount % this.pageSize)) / this.pageSize + 1;
    } else {
      this.totalPages = totalCount;
    }

    this.totalItems = totalCount;
    this.pageNumber = pageNumber;
  }

  public getDataPage(page: number): void {
    const req = this.getReq();
    req.maxResultCount = this.pageSize;
    req.skipCount = (page - 1) * this.pageSize;

    this.isTableLoading = true;
    this.list(req, page, () => {
      this.isTableLoading = false;
    });
  }

  protected abstract getReq(): ABP.PageQueryParams;
  protected abstract list(req: ABP.PageQueryParams, pageNumber: number, finishedCallback: any): void;
  protected abstract delete(entity: EntityDto): void;
}
