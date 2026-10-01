import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-table',
  standalone: true,
  template: `
    <div class="table-container" [attr.aria-label]="label">
      <table class="table">
        <ng-content />
      </table>
    </div>
  `,
  styleUrl: './table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent {
  @Input() label = 'Tabela de dados';
}
