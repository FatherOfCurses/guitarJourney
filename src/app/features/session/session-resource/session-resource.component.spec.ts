import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SessionResourceComponent } from './session-resource.component';
import { SessionResource } from '../../../models/session-resource';

const makeResource = (over: Partial<SessionResource> = {}): SessionResource => ({
  type: 'youtube',
  url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  label: 'Test Video',
  tags: [],
  pinnedAt: { seconds: 0, nanoseconds: 0 } as any,
  ...over,
});

describe('SessionResourceComponent', () => {
  async function setup(resource: SessionResource, showRemove = false) {
    await TestBed.configureTestingModule({
      imports: [SessionResourceComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(SessionResourceComponent);
    fixture.componentInstance.resource = resource;
    fixture.componentInstance.showRemove = showRemove;
    fixture.detectChanges();
    return fixture;
  }

  it('renders an iframe for youtube type', async () => {
    const fixture = await setup(makeResource({ type: 'youtube' }));
    expect(fixture.debugElement.query(By.css('iframe'))).toBeTruthy();
  });

  it('renders an anchor with the resource URL for pdf type', async () => {
    const fixture = await setup(makeResource({ type: 'pdf', url: 'https://example.com/tab.pdf' }));
    const anchor = fixture.debugElement.query(By.css('a'));
    expect(anchor).toBeTruthy();
    expect(anchor.nativeElement.getAttribute('href')).toBe('https://example.com/tab.pdf');
  });

  it('uses pi-file-pdf icon for pdf type', async () => {
    const fixture = await setup(makeResource({ type: 'pdf', url: 'https://example.com/tab.pdf' }));
    expect(fixture.debugElement.query(By.css('i.pi-file-pdf'))).toBeTruthy();
  });

  it('uses pi-list icon for chord-sheet type', async () => {
    const fixture = await setup(makeResource({ type: 'chord-sheet', url: 'https://example.com/chords' }));
    expect(fixture.debugElement.query(By.css('i.pi-list'))).toBeTruthy();
  });

  it('uses pi-link icon for custom type', async () => {
    const fixture = await setup(makeResource({ type: 'custom', url: 'https://example.com' }));
    expect(fixture.debugElement.query(By.css('i.pi-link'))).toBeTruthy();
  });

  it('shows remove button when showRemove=true', async () => {
    const fixture = await setup(makeResource(), true);
    expect(fixture.debugElement.query(By.css('p-button'))).toBeTruthy();
  });

  it('hides remove button by default (showRemove=false)', async () => {
    const fixture = await setup(makeResource(), false);
    expect(fixture.debugElement.query(By.css('p-button'))).toBeNull();
  });

  it('emits the remove event when remove is triggered', async () => {
    const fixture = await setup(makeResource(), true);
    const removeSpy = jest.fn();
    fixture.componentInstance.remove.subscribe(removeSpy);
    fixture.componentInstance.remove.emit();
    expect(removeSpy).toHaveBeenCalledTimes(1);
  });
});
