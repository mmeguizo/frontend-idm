import {
    Component,
    OnInit,
    OnDestroy,
    Input,
    SimpleChanges,
    Output,
    EventEmitter,
    ChangeDetectorRef,
    ChangeDetectionStrategy,
    ViewChild,
    ElementRef,
} from '@angular/core';
import {
    Subject,
    pipe,
    takeUntil,
    tap,
    catchError,
    Observable,
    throwError,
} from 'rxjs';
import { AuthService } from 'src/app/demo/service/auth.service';
import { BaseService } from 'src/app/demo/service/base.service';
import { FileService } from 'src/app/demo/service/file.service';
import { RouteService } from 'src/app/demo/service/route.service';
import { getIcon, getFrequencyKeys } from 'src/app/utlis/file-utils';
import { Table } from 'primeng/table';

@Component({
    selector: 'app-view-file-history',
    templateUrl: './view-file-history.component.html',
    styleUrl: './view-file-history.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewFileHistoryComponent implements OnInit, OnDestroy {
    private getGoalSubscription = new Subject<void>(); // Subscription for getting goal
    @ViewChild('filter') filter!: ElementRef;

    @Input() viewFilesHistory: string;
    viewObjectiveFileHistoryDialogCard: boolean = false;
    loading: boolean = false;
    AllObjectivesHistoryFiles: any[] = [];
    cardOptions: boolean = false;
    objectiveIDforFile: any;

    constructor(
        private fileService: FileService,
        private route: RouteService,
        private changeDetectorRef: ChangeDetectorRef,
        private auth: AuthService
    ) {}

    ngOnInit() {}

    ngOnDestroy(): void {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes['viewFilesHistory']?.currentValue) {
            const { data, viewFilesHistory } =
                changes['viewFilesHistory']?.currentValue;
            this.objectiveIDforFile = data.id;
            //use this when triggering the child component for adding file
            this.getAllFilesHistoryFromObjectiveLoad(data.userId, data.id);
            this.viewObjectiveFileHistoryDialogCard = viewFilesHistory;
        }
    }

    hideViewFileHistoryDialogCard() {
        this.viewObjectiveFileHistoryDialogCard = false;
    }

    getIcon(name: string) {
        return getIcon(name);
    }

    async getAllFilesHistoryFromObjectiveLoad(
        id: string,
        objectiveID: string
    ): Promise<boolean> {
        try {
            this.loading = true;
            this.changeDetectorRef.markForCheck(); // Add this line to trigger change detection
            this.route
                .getRoute(
                    'get',
                    'vice_president_query',
                    `getAllFilesHistoryFromObjectiveLoad/${id}/${objectiveID}`
                )
                .pipe(takeUntil(this.getGoalSubscription))
                .subscribe((data: any) => {
                    this.AllObjectivesHistoryFiles = data.data;
                    this.loading = false;
                    this.changeDetectorRef.markForCheck(); // Add this line to trigger change detection
                });
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    // Add these missing methods
    clear(table: Table) {
        table.clear();
        if (this.filter) {
            this.filter.nativeElement.value = '';
        }
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}